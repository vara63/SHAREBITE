import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export function FoodShareScene() {
  const vehicle = useRef<Group>(null);
  const route = useRef<Group>(null);
  /** One-finger orbit fights vertical page scroll on phones; keep auto-rotate only. */
  const allowPointerOrbit = useMediaQuery("(pointer: fine)");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (vehicle.current) {
      vehicle.current.position.x = Math.sin(t * 0.7) * 0.85;
      vehicle.current.position.z = Math.cos(t * 0.7) * 0.18;
      vehicle.current.rotation.y = Math.sin(t * 0.7) * 0.2;
    }
    if (route.current) route.current.rotation.y = Math.sin(t * 0.35) * 0.06;
  });

  const buildings = [
    [-2.4, -0.95, -0.7, 0.52, 1.3, 0.52, "#314159"],
    [-1.55, -0.72, -1.05, 0.44, 0.86, 0.44, "#42526a"],
    [1.55, -0.82, -0.95, 0.5, 1.08, 0.5, "#2a394f"],
    [2.35, -0.66, -0.35, 0.42, 0.78, 0.42, "#506178"],
    [-2.15, -0.82, 1.0, 0.48, 1.02, 0.48, "#24364c"],
    [2.05, -0.78, 0.92, 0.54, 0.94, 0.54, "#3d4d64"]
  ] as const;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.3, 5.4]} fov={42} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} />
      <spotLight position={[-3, 5, 2]} angle={0.45} penumbra={0.5} intensity={2.4} color="#7dd3fc" />

      <mesh rotation-x={-Math.PI / 2} position={[0, -1.25, 0]}>
        <planeGeometry args={[6.3, 4.2]} />
        <meshStandardMaterial color="#162233" roughness={0.72} metalness={0.08} />
      </mesh>

      <group ref={route}>
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.215, 0]}>
          <boxGeometry args={[4.8, 0.1, 0.08]} />
          <meshStandardMaterial color="#5eead4" emissive="#0f766e" emissiveIntensity={0.7} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} rotation-z={0.72} position={[1.1, -1.205, 0.42]}>
          <boxGeometry args={[1.7, 0.1, 0.08]} />
          <meshStandardMaterial color="#fbbf24" emissive="#92400e" emissiveIntensity={0.55} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} rotation-z={-0.6} position={[-1.3, -1.205, -0.36]}>
          <boxGeometry args={[1.55, 0.1, 0.08]} />
          <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.48} />
        </mesh>
      </group>

      {buildings.map(([x, y, z, w, h, d, color]) => (
        <mesh key={`${x}-${z}`} position={[x, y + h / 2, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} roughness={0.42} metalness={0.25} />
        </mesh>
      ))}

      <Float speed={1.7} floatIntensity={0.25} rotationIntensity={0.15}>
        <group position={[-2.25, 0.65, -0.15]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
            <meshStandardMaterial color="#f97316" emissive="#9a3412" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <coneGeometry args={[0.18, 0.62, 32]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <Text position={[0, 0.38, 0]} fontSize={0.16} color="#fff7ed" anchorX="center">
            DONOR
          </Text>
        </group>
      </Float>

      <Float speed={1.5} floatIntensity={0.22} rotationIntensity={0.12}>
        <group position={[2.25, 0.65, 0.15]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
            <meshStandardMaterial color="#22c55e" emissive="#166534" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <coneGeometry args={[0.18, 0.62, 32]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Text position={[0, 0.38, 0]} fontSize={0.16} color="#ecfdf5" anchorX="center">
            RECEIVER
          </Text>
        </group>
      </Float>

      <group ref={vehicle} position={[0, -0.64, 0.03]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.95, 0.36, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.36} metalness={0.15} />
        </mesh>
        <mesh position={[0.35, 0.42, 0]}>
          <boxGeometry args={[0.34, 0.26, 0.46]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.22} metalness={0.18} />
        </mesh>
        <mesh position={[-0.28, 0.46, 0]}>
          <boxGeometry args={[0.38, 0.24, 0.36]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.32} />
        </mesh>
        {[-0.32, 0.34].map((x) => (
          <group key={x}>
            <mesh position={[x, -0.03, 0.28]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[x, -0.03, -0.28]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        ))}
      </group>

      <Float speed={2.1} floatIntensity={0.35}>
        <group position={[0, 1.72, 0]}>
          <mesh>
            <boxGeometry args={[2.65, 0.72, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.28} metalness={0.45} />
          </mesh>
          <Text position={[-0.92, 0.1, 0.06]} fontSize={0.15} color="#cbd5e1" anchorX="left">
            NEURAL DISPATCH
          </Text>
          <Text position={[-0.92, -0.16, 0.06]} fontSize={0.24} color="#ffffff" anchorX="left">
            24 min | INR 186
          </Text>
          <Text position={[0.77, -0.18, 0.06]} fontSize={0.18} color="#a78bfa" anchorX="left">
            92 FRESH
          </Text>
        </group>
      </Float>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={allowPointerOrbit}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}
