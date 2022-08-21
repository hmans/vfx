import { useConst } from "@hmans/use-const"
import { useFrame } from "@react-three/fiber"
import { cloneElement, FC, useLayoutEffect, useRef } from "react"
import { makeStore, useStore } from "statery"
import { Mesh, MeshPhysicalMaterial } from "three"

const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore({
    count: 0,
    instance: null as any
  })

  const setInstance = (instance: any) => {
    console.log("setInstance", instance)
    store.set({ instance })
  }

  const increaseCount = () => {
    store.set(({ count }) => ({ count: count + 1 }))
  }

  const decreaseCount = () => {
    store.set(({ count }) => ({ count: count - 1 }))
  }

  return (props: P) => {
    const id = useConst(() => {
      increaseCount()
      return store.state.count
    })

    useLayoutEffect(() => {
      return () => decreaseCount()
    }, [])

    const { instance } = useStore(store)

    if (id > 1) {
      return instance ? <primitive object={instance} attach="material" /> : null
    } else {
      return cloneElement(component(props)!, {
        ref: setInstance
      })
    }
  }
}

export default function Playground() {
  const ref = useRef<Mesh<any, MeshPhysicalMaterial>>(null!)

  /* For testing, we'll mutate one of the mesh's material's
     color. If the resource sharing works, the colors of both
     meshes will update. */
  useFrame(({ clock }) => {
    ref.current!.material.color.setScalar(
      (Math.sin(clock.elapsedTime * 3) + 1) / 2
    )
  })

  return (
    <group position-y={1.5}>
      <mesh position-x={-1.5}>
        <sphereGeometry />
        <ThingyMaterial />
      </mesh>

      <mesh position-x={+1.5} ref={ref}>
        <dodecahedronGeometry />
        <ThingyMaterial />
      </mesh>
    </group>
  )
}

const ThingyMaterial = sharedResource(() => (
  <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" />
))
