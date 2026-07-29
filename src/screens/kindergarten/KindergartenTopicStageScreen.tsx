import type { PreschoolStageWorldConfig } from "@/src/data/preschoolStageWorldTypes";
import { PreschoolTopicStageScreen } from "@/src/screens/preschool/shared/PreschoolTopicStageScreen";

type KindergartenTopicStageScreenProps = {
  config: PreschoolStageWorldConfig;
};

export function KindergartenTopicStageScreen({
  config,
}: KindergartenTopicStageScreenProps) {
  return <PreschoolTopicStageScreen config={config} />;
}
