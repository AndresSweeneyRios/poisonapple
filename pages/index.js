import '../sass/global.sass'
import css from "./index.sass"

import {
    Scene, WebGLRenderer, HemisphereLight, DirectionalLight, AmbientLight, PointLight, 
    Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneBufferGeometry
} from 'three'

import FBXLoader from 'three-fbxloader-offical'

export default class extends React.Component {
    async componentDidMount () {
        const fbx = new FBXLoader()

        const scene = new Scene()
        const renderer = new WebGLRenderer({ antialias: true })
        const camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 )

        const hemisphere = new HemisphereLight( 0xd9efff, 0x313131, 0.8 );
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

        apple.traverse( child =>
            child.material = new MeshStandardMaterial({ 
                color: {
                    "Pink": 0xfe567f, "Stem": 0x72624a,
                    "Leaf": 0x65fe82, "Blue": 0x80d1fe
                } [child.name],

                roughness: 1
            })
        )

        renderer.setSize( window.innerWidth, window.innerHeight )

        camera.position.z = 6
        camera.position.y = 0.1

        apple.scale.set( 0.01, 0.01, 0.01 )
        apple.rotation.set( 0.5, -0.5, 0 )

        sun.position.set( 0, 0.5, 4 )
        plane.position.set( 0, 0, -4 )
        pointlight.position.set( -4, 0, 12 )
        pointlightBack.position.set( 3, 3, 2 )
        apple.position.set( 0, -0.7, 0 )

        sun.castShadow = true;

        scene.add( ambient, hemisphere, sun, pointlight, pointlightBack, apple, plane )

        const animate = () => {
            requestAnimationFrame( animate )
            renderer.render( scene, camera )
        }

        animate()

        setInterval( () => apple.rotation.y += 0.01, 20 )

        document.querySelector(`.${css.background}`).appendChild(renderer.domElement)
    }
    
    render () {
        return (
            <div>
                <div className={css.background}></div>
            </div>
        )
    }
}