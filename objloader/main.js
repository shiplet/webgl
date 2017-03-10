(function(THREE){


    var Item = new ObjTest({ mtlPath: 'obj/speaker/', mtl: 'speaker.mtl', objPath: 'obj/speaker/', obj: 'speaker.obj' })


    function ObjTest(config) {
        this.config = config
        this.container = null
        this.camera = null
        this.scene = null
        this.renderer = null
        this.mouseX = 0
        this.mouseY = 0
        this.windowHalfX = window.innerWidth / 2.0
        this.windowHalfY = window.innerHeight / 2.0
        this.clearColor = 0x000000
        this.mesh = null
        this.shouldAutoRotate = false
        this.diffuseTexture = null
        this.bumpTexture = null
        this.emissiveTexture = null
        this.specularTexture = null

        this.init = function() {
            this.container = document.createElement( 'div' )
            document.body.appendChild( this.container )
            this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
            this.camera.position.x = 0
            this.camera.position.y = 10
            this.camera.position.z = 20

            this.scene = new THREE.Scene()

            var ambient = new THREE.AmbientLight( 0xffffff )
            this.scene.add(ambient)

            for(var i = 0; i < 3; i++) {
                var directionalLight = new THREE.DirectionalLight( 0xffeedd )
                directionalLight.position.set( Math.random() * 10, Math.random() * 10, Math.random() * 10 ).normalize()
                this.scene.add( directionalLight )
            }

            var hemisphereLight = new THREE.HemisphereLight( 0xffffff )
            this.scene.add(hemisphereLight)

            var loader = new THREE.JSONLoader()
            loader.load('obj/r2d2/r2.js', function(geometry, materials){
                this.mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) )
                this.scene.add(this.mesh)
            }.bind(this))

            this.renderer = new THREE.WebGLRenderer({alpha: true})
            this.renderer.setPixelRatio( window.devicePixelRatio )
            this.renderer.setSize( window.innerWidth, window.innerHeight )
            this.renderer.setClearColor( this.clearColor, 0 )
            this.container.appendChild( this.renderer.domElement )

            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement )

            window.addEventListener( 'resize', this.onWindowResize, false )
            window.addEventListener( 'mousedown', this.onWindowMouseDown, false )
            window.addEventListener( 'mouseup', this.onWindowMouseUp, false )
    }.bind(this)

    this.onProgress = function( xhr ){
        if( xhr.lengthComputable )
        {
            var percentComplete = xhr.loaded / xhr.total * 100
            console.log( Math.round( percentComplete, 2 ) +  "% downloaded" )
        }
    }.bind(this)

    this.onError = function(){}.bind(this)

    this.onWindowResize = function() {
        this.windowHalfX = window.innerWidth / 2.0
        this.windowHalfY = window.innerHeight / 2.0

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }.bind(this)

    this.onWindowMouseDown = function() {
        this.shouldAutoRotate = false
    }.bind(this)

    this.onWindowMouseUp = function() {
        this.shouldAutoRotate = true
    }.bind(this)

    this.animate = function() {
        requestAnimationFrame( this.animate )
        this.render()
    }.bind(this)

    this.render = function() {
        if(this.mesh && this.mesh.rotation && this.shouldAutoRotate)
        {
            // this.mesh.rotation.x -= 0.005
            this.mesh.rotation.y += 0.005
            // this.mesh.rotation.z += 0.005
        }
        this.camera.lookAt( this.scene.position )
        this.renderer.render( this.scene, this.camera )
    }.bind(this)

    this.init()
    this.animate()

}


})(THREE)