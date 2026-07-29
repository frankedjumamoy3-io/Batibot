import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

export type VoiceSearchStatus =
  | "idle"
  | "listening"
  | "no-speech"
  | "processing"
  | "unsupported";

export type VoiceSearchCopy = {
  disabledMessage: string;
  disabledTitle: string;
  nativeServiceUnavailableMessage: string;
  nativeUnavailableMessage: string;
  noSpeechMessage: string;
  permissionDeniedMessage: string;
  permissionDeniedTitle: string;
  prompt: string;
  resetUnavailableMessage: string;
  resetUnavailableTitle: string;
  unavailableMessage: string;
  unavailableTitle: string;
};

type UseVoiceSearchOptions = {
  contextStrings?: string[];
  copy: VoiceSearchCopy;
  enabled: boolean;
  onTranscript: (transcript: string) => void;
};

type SpeechRecognitionSubscription = {
  remove: () => void;
};

type NativeSpeechRecognitionModule = {
  addListener: (
    eventName: "start" | "end" | "error" | "result",
    listener: (event?: unknown) => void
  ) => SpeechRecognitionSubscription;
  isRecognitionAvailable: () => boolean;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  start: (options: {
    androidIntentOptions?: {
      EXTRA_LANGUAGE_MODEL?: "free_form" | "web_search";
      EXTRA_PROMPT?: string;
    };
    contextualStrings?: string[];
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
  }) => void;
  stop: () => void;
};

type NativeSpeechRecognitionResultEvent = {
  results?: { transcript?: string }[];
};

type NativeSpeechRecognitionErrorEvent = {
  error?: string;
  message?: string;
};

type BrowserSpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript?: string }>>;
      }) => void)
    | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor =
  new () => BrowserSpeechRecognitionInstance;

function getSpeechRecognitionConstructor():
  | BrowserSpeechRecognitionConstructor
  | null {
  if (Platform.OS !== "web") {
    return null;
  }

  const browserWindow = globalThis as typeof globalThis & {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };

  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

async function getNativeSpeechRecognitionModule() {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    const speechRecognition = await import("expo-speech-recognition");

    return speechRecognition.ExpoSpeechRecognitionModule as unknown as NativeSpeechRecognitionModule;
  } catch {
    return null;
  }
}

export function useVoiceSearch({
  contextStrings = [],
  copy,
  enabled,
  onTranscript,
}: UseVoiceSearchOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isNativeUnavailable, setIsNativeUnavailable] = useState(false);
  const [status, setStatus] = useState<VoiceSearchStatus>("idle");
  const recognitionRef = useRef<BrowserSpeechRecognitionInstance | null>(null);
  const nativeRecognitionRef = useRef<NativeSpeechRecognitionModule | null>(null);
  const nativeRecognitionSubscriptionsRef = useRef<SpeechRecognitionSubscription[]>([]);
  const transcriptHandledRef = useRef(false);

  const isSupported =
    enabled &&
    (Platform.OS === "web" ? !!getSpeechRecognitionConstructor() : !isNativeUnavailable);

  const clearNativeSpeechListeners = useCallback(() => {
    nativeRecognitionSubscriptionsRef.current.forEach((subscription) => {
      subscription.remove();
    });
    nativeRecognitionSubscriptionsRef.current = [];
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    nativeRecognitionRef.current?.stop();
    setIsListening(false);
    setStatus("idle");
  }, []);

  const handleTranscript = useCallback(
    (rawTranscript?: string) => {
      const transcript = rawTranscript?.trim() ?? "";

      if (!transcript) {
        setStatus("no-speech");
        return;
      }

      transcriptHandledRef.current = true;
      setStatus("processing");
      onTranscript(transcript);
      setStatus("idle");
    },
    [onTranscript]
  );

  const startNativeVoiceSearch = useCallback(async () => {
    const nativeRecognition = await getNativeSpeechRecognitionModule();

    if (!nativeRecognition) {
      setIsNativeUnavailable(true);
      setStatus("unsupported");
      Alert.alert(copy.unavailableTitle, copy.nativeUnavailableMessage);
      return;
    }

    if (!nativeRecognition.isRecognitionAvailable()) {
      setIsNativeUnavailable(true);
      setStatus("unsupported");
      Alert.alert(copy.unavailableTitle, copy.nativeServiceUnavailableMessage);
      return;
    }

    const permission = await nativeRecognition.requestPermissionsAsync();

    if (!permission.granted) {
      setStatus("idle");
      Alert.alert(copy.permissionDeniedTitle, copy.permissionDeniedMessage);
      return;
    }

    nativeRecognitionRef.current = nativeRecognition;
    transcriptHandledRef.current = false;
    clearNativeSpeechListeners();
    nativeRecognitionSubscriptionsRef.current = [
      nativeRecognition.addListener("start", () => {
        setIsListening(true);
        setStatus("listening");
      }),
      nativeRecognition.addListener("end", () => {
        setIsListening(false);
        setStatus((currentStatus) =>
          transcriptHandledRef.current || currentStatus === "unsupported"
            ? currentStatus
            : "no-speech"
        );
      }),
      nativeRecognition.addListener("error", (event) => {
        const errorEvent = event as NativeSpeechRecognitionErrorEvent | undefined;
        const noSpeechError = errorEvent?.error === "no-speech";

        setIsListening(false);
        setStatus(noSpeechError ? "no-speech" : "idle");

        Alert.alert(
          noSpeechError ? copy.resetUnavailableTitle : copy.resetUnavailableTitle,
          noSpeechError
            ? copy.noSpeechMessage
            : errorEvent?.message || copy.resetUnavailableMessage
        );
      }),
      nativeRecognition.addListener("result", (event) => {
        const resultEvent = event as NativeSpeechRecognitionResultEvent | undefined;
        handleTranscript(resultEvent?.results?.[0]?.transcript);
      }),
    ];

    nativeRecognition.start({
      androidIntentOptions: {
        EXTRA_LANGUAGE_MODEL: "web_search",
        EXTRA_PROMPT: copy.prompt,
      },
      contextualStrings: contextStrings,
      continuous: false,
      interimResults: false,
      lang: "en-US",
      maxAlternatives: 1,
    });
  }, [clearNativeSpeechListeners, contextStrings, copy, handleTranscript]);

  const startWebVoiceSearch = useCallback(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setStatus("unsupported");
      Alert.alert(copy.unavailableTitle, copy.unavailableMessage);
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;
      recognition.onstart = () => {
        transcriptHandledRef.current = false;
        setIsListening(true);
        setStatus("listening");
      };
      recognition.onend = () => {
        setIsListening(false);
        setStatus((currentStatus) =>
          transcriptHandledRef.current || currentStatus === "unsupported"
            ? currentStatus
            : "no-speech"
        );
      };
      recognition.onerror = (event) => {
        const noSpeechError = event.error === "no-speech";

        setIsListening(false);
        setStatus(noSpeechError ? "no-speech" : "idle");
        Alert.alert(
          copy.resetUnavailableTitle,
          noSpeechError ? copy.noSpeechMessage : copy.resetUnavailableMessage
        );
      };
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? "")
          .join(" ");

        handleTranscript(transcript);
      };
      recognitionRef.current = recognition;
    }

    transcriptHandledRef.current = false;
    recognitionRef.current.start();
  }, [copy, handleTranscript]);

  const start = useCallback(async () => {
    if (!enabled) {
      Alert.alert(copy.disabledTitle, copy.disabledMessage);
      return;
    }

    if (Platform.OS !== "web") {
      await startNativeVoiceSearch();
      return;
    }

    startWebVoiceSearch();
  }, [copy.disabledMessage, copy.disabledTitle, enabled, startNativeVoiceSearch, startWebVoiceSearch]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
      return;
    }

    void start();
  }, [isListening, start, stop]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      clearNativeSpeechListeners();
      nativeRecognitionRef.current?.stop();
    };
  }, [clearNativeSpeechListeners]);

  return {
    isListening,
    isSupported,
    start,
    status,
    stop,
    toggle,
  };
}
