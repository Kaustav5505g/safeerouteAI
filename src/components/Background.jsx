import Particles from "@tsparticles/react"
import { loadSlim } from "tsparticles-slim"

function Background() {

  const particlesInit = async (engine) => {
    await loadSlim(engine)
  }

  return (

    <div className="absolute inset-0 z-0">

      <Particles

        id="tsparticles"

        init={particlesInit}

        options={{

          background: {
            color: {
              value: "#050816"
            }
          },

          fpsLimit: 120,

          interactivity: {

            events: {

              onHover: {
                enable: true,
                mode: "grab"
              },

              onClick: {
                enable: true,
                mode: "push"
              },

              resize: true

            },

            modes: {

              grab: {
                distance: 180,

                links: {
                  opacity: 0.5
                }
              },

              push: {
                quantity: 5
              }

            }

          },

          particles: {

            color: {
              value: ["#ec4899", "#8b5cf6", "#3b82f6"]
            },

            links: {

              color: "#ffffff",

              distance: 150,

              enable: true,

              opacity: 0.15,

              width: 1

            },

            move: {

              direction: "none",

              enable: true,

              outModes: {
                default: "bounce"
              },

              random: false,

              speed: 1.5,

              straight: false

            },

            number: {

              density: {
                enable: true
              },

              value: 80

            },

            opacity: {
              value: 0.5
            },

            shape: {
              type: "circle"
            },

            size: {

              value: { min: 1, max: 4 }

            }

          },

          detectRetina: true

        }}

      />

    </div>

  )
}

export default Background