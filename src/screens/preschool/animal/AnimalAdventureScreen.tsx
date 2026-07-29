import { preschoolAnimalAdventure } from "@/src/data/preschoolAnimalAdventure";
import { PreschoolWorldScreen } from "@/src/screens/preschool/shared/PreschoolWorldScreen";

export function AnimalAdventureScreen() {
  return <PreschoolWorldScreen config={preschoolAnimalAdventure} />;
}
