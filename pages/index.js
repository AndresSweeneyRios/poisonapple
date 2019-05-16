import '../sass/global.sass'
import css from "./index.sass"
import Link from 'next/link'

import {
    Scene, WebGLRenderer, HemisphereLight, DirectionalLight, AmbientLight, PointLight, 
    Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneBufferGeometry,
    Vector2, Clock
} from 'three'

import {
    EffectComposer, EffectPass, RenderPass, BlendFunction, 
    ScanlineEffect, NoiseEffect
} from 'postprocessing'

import FBXLoader from 'three-fbxloader-offical'

export default class extends React.Component {
    async componentDidMount () {
        const container = document.querySelector(`.${css.background}`)

        const fbx = new FBXLoader()

        const scene = new Scene()
        const composer = new EffectComposer(new WebGLRenderer({
            logarithmicDepthBuffer: true,
            antialias: true
        }))
        const camera = new PerspectiveCamera( 50, container.offsetWidth / container.offsetHeight, 0.1, 1000 )

        const hemisphere = new HemisphereLight( 0xd9efff, 0x313131, 0.8 )
        const sun = new DirectionalLight( 0xE0D5FF, 1 )
        const ambient = new AmbientLight( 0x303030 )
        const pointlight = new PointLight( 0xffffff, 0.4, 100)
        const pointlightBack = new PointLight( 0xffffff, 0.3, 100)

        const plane = new Mesh( 
            new PlaneBufferGeometry( 40, 40, 40, 40 ), 
            new MeshBasicMaterial({ color: 0x373737 })
        )

        const apple = await new Promise ( 
            resolve => fbx.load( 'static/apple.fbx', resolve )
        )

        apple.traverse( child => {
            if (!child.material) return

            child.material = new MeshStandardMaterial({ 
                color: {
                    "Pink": 0xfe567f, "Stem": 0x72624a,
                    "Leaf": 0x65fe82, "Blue": 0x80d1fe
                } [child.name],

                roughness: 1
            })
        })

        composer.setSize( container.offsetWidth*2, container.offsetHeight*2 )
        composer.renderer.setSize( container.offsetWidth, container.offsetHeight )

        camera.position.z = 6
        camera.position.y = 0.1

        apple.scale.set( 0.01, 0.01, 0.01 )
        apple.rotation.set( 0.5, -0.5, 0 )

        sun.position.set( 0, 0.5, 4 )
        plane.position.set( 0, 0, -4 )
        pointlight.position.set( -4, 0, 12 )
        pointlightBack.position.set( 3, 3, 2 )
        apple.position.set( 0, -0.7, 0 )

        sun.castShadow = true

        scene.add( ambient, hemisphere, sun, pointlight, pointlightBack, apple, plane )

		const scanlineEffect = new ScanlineEffect({
			blendFunction: BlendFunction.ALPHA,
            density: 1.3
        })

		const noiseEffect = new NoiseEffect({ 
            blendFunction: BlendFunction.COLOR_DODGE 
        })

        scanlineEffect.blendMode.opacity.value = 0.02
        noiseEffect.blendMode.opacity.value = 0.08

        const effectPass = new EffectPass(  camera, scanlineEffect, noiseEffect )
        effectPass.renderToScreen = true

        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(effectPass)

        const clock = new Clock()

        const animate = () => {
            requestAnimationFrame( animate )
            composer.render( clock.getDelta() )
        }

        animate()

        setInterval( () => apple.rotation.y += 0.01, 20 )

        document.querySelector(`.${css.background}`).appendChild(composer.renderer.domElement)
    }
    
    nav () {
        const html = []

        for (const i of [
            'Projects',
            'Contact',
            'Social',
        ]) html.push(
            <Link key={i} href={ '/' + i.toLowerCase() }>
                <div>
                    <h3>{ i }</h3><img src={ `static/icons/${i.toLowerCase()}.svg`}/>
                </div>
            </Link>
        )

        return <div className={ css.navigation }>{ html }</div>
    }

    render () {
        return (
            <div className={ css.home }>
                <link href="https://fonts.googleapis.com/css?family=Tajawal" rel="stylesheet" />
                <meta name="theme-color" content="#272727"></meta> 
                <div className={ css.background }></div>
                <h1>Andres<br/>Sweeney-<br/>Rios</h1>
                { this.nav() }
            </div>
        )
    }
}