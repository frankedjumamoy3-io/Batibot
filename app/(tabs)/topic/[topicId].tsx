import { Redirect, useLocalSearchParams } from "expo-router";

import { APP_ROUTES } from "@/src/navigation/routes";

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function TopicStageRoute() {
  const params = useLocalSearchParams<{ topicId?: string | string[] }>();
  const topicId = getParamValue(params.topicId);

  if (!topicId) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }

  return (
    <Redirect
      href={{
        pathname: APP_ROUTES.lesson.topic,
        params: { topicId },
      }}
    />
  );
}
