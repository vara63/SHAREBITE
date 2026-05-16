import { Canvas } from "@react-three/fiber";
import { FoodShareScene } from "./FoodShareScene";

export default function ProductVisualInner() {
  return (
    <Canvas className="h-full w-full max-w-full" dpr={[1, 2]}>
      <FoodShareScene />
    </Canvas>
  );
}
