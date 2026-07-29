import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Animated, Text, useWindowDimensions, View } from "react-native";

import { animatedWordImageStyles as styles } from "@/components/vocabulary/animated-word-image.styles";
import {
  VOCABULARY_LOTTIE_SOURCES,
  type VocabularySubcategory,
} from "@/src/data/vocabulary";

type AnimatedWordImageProps = {
  accentColor: string;
  emoji: string;
  imageUri: string;
  recognitionPrompt: string;
  subcategory: VocabularySubcategory;
  variant: "card" | "detail" | "featured";
};

export function AnimatedWordImage({
  accentColor,
  emoji,
  imageUri,
  recognitionPrompt,
  subcategory,
  variant,
}: AnimatedWordImageProps) {
  const { width } = useWindowDimensions();
  const bobAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const isCompactFeatured = variant === "featured" && width < 390;
  const shouldAnimate = variant !== "card";

  useEffect(() => {
    if (!shouldAnimate) {
      bobAnimation.setValue(0);
      pulseAnimation.setValue(1);
      return;
    }

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnimation, {
          toValue: -6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnimation, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.02,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    bobLoop.start();
    pulseLoop.start();

    return () => {
      bobLoop.stop();
      pulseLoop.stop();
    };
  }, [bobAnimation, pulseAnimation, shouldAnimate]);

  const variantStyle =
    variant === "featured"
      ? styles.featuredContainer
      : variant === "detail"
        ? styles.detailContainer
        : styles.cardContainer;
  const showLottieOverlay = variant !== "card";

  return (
    <Animated.View
      style={[
        styles.imageFrame,
        variantStyle,
        isCompactFeatured && styles.featuredContainerCompact,
        {
          transform: [{ translateY: bobAnimation }, { scale: pulseAnimation }],
        },
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="cover"
        transition={180}
      />

      {showLottieOverlay ? (
        <LottieView
          source={VOCABULARY_LOTTIE_SOURCES[subcategory] as unknown as string}
          autoPlay
          loop
          style={styles.lottieOverlay}
        />
      ) : null}

      <View style={[styles.badge, { backgroundColor: accentColor }]}>
        <Text style={styles.badgeText}>{emoji}</Text>
      </View>

      <View style={styles.promptBubble}>
        <Text style={styles.promptText}>{recognitionPrompt}</Text>
      </View>
    </Animated.View>
  );
}
