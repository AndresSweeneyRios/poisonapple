import * as THREE from 'three'
import '../sass/global.sass'
import css from "./index.sass"
import FBXLoader from 'three-fbxloader-offical'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing"

export default class extends React.Component {
    async componentDidMount () {
        const fbx = new FBXLoader()
        const scene = new THREE.Scene()
        const composer = new EffectComposer(new THREE.WebGLRenderer())
        const renderer = composer.renderer
        const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 )
        const sun = new THREE.DirectionalLight( 0xffffff, 1 )
        const ambient = new THREE.AmbientLight( 0x91e9de )
        const pointlight = new THREE.PointLight( 0xffffff, 0.4, 100)

        const effectPass = new EffectPass(camera, new BloomEffect({
            distinction: 2.0,
        }))
        
        effectPass.renderToScreen = true
 
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(effectPass)

        pointlight.position.set( -2, 0, 6 );

        const apple = await new Promise ( (resolve, reject) => 
            fbx.load(
                'static/apple.fbx',
                resolve,
                undefined,
                console.error
            )
        )

        sun.position.set( 0, 0.5, 1 )

        renderer.shadowMap.enabled = true;
        sun.castShadow = true;

        camera.position.z = 4
        camera.position.y = 0.2

        apple.scale.set(0.01, 0.01, 0.01)
        apple.rotation.set(0.5,-0.5,0)
        apple.position.set(0,-0.7,0)

        apple.traverse( child => {
            if (!child.material) return

            child.material = new THREE.MeshStandardMaterial( { 
                color: {
                    "Pink": 0xfe567f,
                    "Stem": 0x72624a,
                    "Leaf": 0x65fe82,
                    "Blue": 0x80d1fe
                }[child.name],

                roughness: 0.7
            })
        })

        composer.setSize( window.innerWidth, window.innerHeight )

        renderer.setSize( window.innerWidth, window.innerHeight )

        scene.add( sun )
        scene.add( ambient )
        scene.add( apple )
        scene.add( pointlight )
 
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame( animate )
            composer.render(clock.getDelta());
        }

        animate()

        setInterval(() => apple.rotation.y += 0.015, 20)

        document.querySelector(`.${css.background}`).appendChild(composer.renderer.domElement)
    }
    
    render () {
        return (
            <div>
                <div className={css.background}></div>
            </div>
        )
    }
}