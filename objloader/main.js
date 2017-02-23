(function(THREE){


var Item = new ObjTest({ mtlPath: 'materials/', mtl: 'BasicSpeaker.mtl', objPath: './', obj: 'BasicSpeaker.obj' })


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

    this.init = function() {
        this.container = document.createElement( 'div' )
        document.body.appendChild( this.container )
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
        this.camera.position.x = 8
        this.camera.position.y = 2
        this.camera.position.z = 8

        this.scene = new THREE.Scene()

        var ambient = new THREE.AmbientLight( 0x444444 )
        this.scene.add(ambient)

        var directionalLight = new THREE.DirectionalLight( 0xffeedd )
        directionalLight.position.set( 0, 0, 1 ).normalize()
        this.scene.add( directionalLight )

        var onProgress = function( xhr ) {
            if( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100
                console.log( Math.round(percentComplete, 2) + '% downloaded' )
            }
        }.bind(this)

        var onError = function( xhr ) {}.bind(this)

        var mtlLoader = new THREE.MTLLoader()
        console.log(this.config.mtlPath)
        mtlLoader.setPath( this.config.mtlPath )
        mtlLoader.load( this.config.mtl, function( materials ){
            if(materials.materialsArray > 0)
            {
                materials.preload()

                var objLoader = new THREE.OBJLoader()
                objLoader.setMaterials( materials )
                objLoader.setPath( this.config.objPath )
                objLoader.load( this.config.obj, function( object ){
                    object.position.y = 0
                    this.scene.add( object )
                }.bind(this), onProgress, onError )
            }
            else
            {
                var objLoader = new THREE.OBJLoader()
                objLoader.setPath( this.config.objPath )
                objLoader.load( this.config.obj, function(object){
                    object.position.y = 0
                    this.scene.add( object )
                }.bind(this) )
            }
        }.bind(this) )

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.setClearColor( this.clearColor, 1 )
        this.container.appendChild( this.renderer.domElement )

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement )

        window.addEventListener( 'resize', this.onWindowResize, false )
    }.bind(this)

    this.onWindowResize = function() {
        this.windowHalfX = window.innerWidth / 2.0
        this.windowHalfY = window.innerHeight / 2.0

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }.bind(this)

    this.animate = function() {
        requestAnimationFrame( this.animate )
        this.render()
    }.bind(this)

    this.render = function() {
        this.camera.lookAt( this.scene.position )
        this.renderer.render( this.scene, this.camera )
    }.bind(this)

    this.init()
    this.animate()

}


})(THREE)