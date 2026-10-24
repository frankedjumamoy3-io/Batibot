import { useEffect } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ConfettiBurst } from "@/components/animation/confetti-burst";
import { LESSON_REWARD_ASSETS } from "@/src/data/play-assets";

type StandardRewardStageProps = {
  alreadyClaimed?: boolean;
  stars?: number;
  title?: string;
  topicLabel?: string;
  xp?: number;
};

const RAY_COUNT = 8;

/** Fade + spring "pop" entrance used by each reward element, staggered by delay. */
function usePopIn(delay: number, reduceMotion: boolean) {
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(delay, withSpring(1, { damping: 11, mass: 0.7, stiffness: 140 }));
    return () => cancelAnimation(progress);
  }, [delay, progress, reduceMotion]);

  return useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value * 1.6),
    transform: [
      { translateY: (1 - progress.value) * 18 },
      { scale: 0.55 + progress.value * 0.45 },
    ],
  }));
}

export function StandardRewardStage({
  alreadyClaimed = false,
  stars = 1,
  title,
  topicLabel,
  xp = 10,
}: StandardRewardStageProps) {
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();
  const chestSize = Math.round(Math.max(130, Math.min(200, height * 0.22)));

  const float = useSharedValue(0);
  const spin = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    float.value = withDelay(
      700,
      withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
    spin.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1, false);
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(float);
      cancelAnimation(spin);
      cancelAnimation(glow);
    };
  }, [float, glow, reduceMotion, spin]);

  const titleStyle = usePopIn(0, reduceMotion);
  const chestPopStyle = usePopIn(140, reduceMotion);
  const messageStyle = usePopIn(420, reduceMotion);
  const starStyle = usePopIn(620, reduceMotion);
  const xpStyle = usePopIn(780, reduceMotion);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 * float.value }],
  }));
  const raysStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + glow.value * 0.3,
    transform: [{ rotate: `${spin.value}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + glow.value * 0.35,
    transform: [{ scale: 0.94 + glow.value * 0.1 }],
  }));

  const heading = alreadyClaimed ? "REWARD CLAIMED" : title ?? "GOOD JOB!";
  const message = alreadyClaimed
    ? "Already completed"
    : topicLabel
      ? `${topicLabel} complete`
      : "Topic complete";
  const stageSize = chestSize * 1.35;

  return (
    <View
      accessible
      accessibilityLabel={`${heading}. ${message}. Plus ${stars} star, plus ${xp} XP.`}
      style={styles.wrap}
    >
      {!alreadyClaimed ? <ConfettiBurst /> : null}

      <Animated.Text style={[styles.title, titleStyle]}>{heading}</Animated.Text>

      <View style={[styles.chestStage, { height: stageSize, width: stageSize }]}>
        <Animated.View style={[styles.rays, { height: stageSize, width: stageSize }, raysStyle]}>
          {Array.from({ length: RAY_COUNT }, (_, index) => (
            <View
              key={index}
              style={[
                styles.ray,
                {
                  height: stageSize,
                  left: stageSize / 2 - 9,
                  transform: [{ rotate: `${(180 / RAY_COUNT) * index}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>
        <Animated.View
          style={[
            styles.glow,
            { borderRadius: chestSize, height: chestSize, width: chestSize },
            glowStyle,
          ]}
        />
        <Animated.View style={chestPopStyle}>
          <Animated.View style={floatStyle}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={LESSON_REWARD_ASSETS.openChest}
              style={{ height: chestSize, width: chestSize }}
            />
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.Text numberOfLines={2} style={[styles.message, messageStyle]}>
        {message}
      </Animated.Text>

      <View style={styles.rewardRow}>
        <Animated.View style={[styles.rewardPill, styles.starPill, starStyle]}>
          <Image resizeMode="contain" source={LESSON_REWARD_ASSETS.star} style={styles.rewardIcon} />
          <Text style={[styles.rewardText, styles.starText]}>+{stars} STAR</Text>
        </Animated.View>
        <Animated.View style={[styles.rewardPill, styles.xpPill, xpStyle]}>
          <Image resizeMode="contain" source={LESSON_REWARD_ASSETS.xp} style={styles.rewardIcon} />
          <Text style={[styles.rewardText, styles.xpText]}>+{xp} XP</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chestStage: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  glow: {
    backgroundColor: "#FFF3B0",
    position: "absolute",
    shadowColor: "#FBBF24",
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
  },
  message: {
    color: "#44239A",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
    textAlign: "center",
  },
  ray: {
    backgroundColor: "rgba(253, 224, 71, 0.45)",
    borderRadius: 9,
    position: "absolute",
    top: 0,
    width: 18,
  },
  rays: {
    position: "absolute",
  },
  rewardIcon: {
    height: 30,
    width: 30,
  },
  rewardPill: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 2,
    elevation: 2,
    flexDirection: "row",
    gap: 6,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 5,
    shadowColor: "#4C1D95",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 14,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "900",
  },
  starPill: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FBBF24",
  },
  starText: {
    color: "#B45309",
  },
  title: {
    color: "#681BF2",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    width: "100%",
  },
  xpPill: {
    backgroundColor: "#F5F3FF",
    borderColor: "#8B5CF6",
  },
  xpText: {
    color: "#6D28D9",
  },
});
