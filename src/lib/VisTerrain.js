var THREE = require('three');
THREE.TrackballControls = require('three-trackballcontrols');

module.exports = function(canvas, data)
{
    console.assert(canvas.width > 0 && canvas.height > 0, 'canvas width/height not set');

    var TerrainFunction = function(data){
        var minX = 1e10, maxX = -1e10, minZ = 1e10, maxZ = -1e10;
        var padding = 2;
        data.forEach(function(d){
            minX = Math.min(minX, d[0]);
            maxX = Math.max(maxX, d[0]);
            minZ = Math.min(minZ, d[2]);
            maxZ = Math.max(maxZ, d[2]);
        });
        this.Add = function(x, y, z){
            data.push([x, y, z]);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        };
        this.getFunction = function(u, v){
            if(data.length == 0)
            {
                return new THREE.Vector3(0,0,0);
            }
            var rangeX = maxX-minX+padding+padding,
                rangeZ = maxZ-minZ+padding+padding;
            var tx = u*rangeX+minX-padding,
                tz = v*rangeZ+minZ-padding;
            var dists = data.map(function(d){
                return (d[0]-tx)*(d[0]-tx)+(d[2]-tz)*(d[2]-tz);
            });
            var minD = dists.reduce(function(a, b){
                return Math.min(a, b);
            }, 1e10);
            var denominator = dists.reduce(function(p, c){
                return (c-minD<1e-4)?p+1:p+(minD/c)*(minD/c);
            }, 0);
            var numerator = dists.reduce(function(p, c, i){
                return p+(c-minD<1e-4?1:(minD/c)*(minD/c))*data[i][1];
            }, 0);
            return new THREE.Vector3(tx, numerator/denominator, tz);
        };
    };

    // Initialize render and TrackballControls
    function render(){
        renderer.render(scene,camera);
    }

    function CreateTrackballControls(camera, canvas, render, lookat) {
        var controls = new THREE.TrackballControls(camera, canvas);
        controls.target = new THREE.Vector3(lookat.x, lookat.y, lookat.z);
        controls.noPan = true;
        controls.noZoom = true;
        controls.staticMoving = true;
        function move() {
            controls.update();
            render();
        }
        function down() {
            document.addEventListener("mousemove", move, false);
        }
        function up() {
            document.removeEventListener("mousemove", move, false);
        }
        function touch(event) {
            if (event.touches.length == 1) {
                move();
            }
        }
        canvas.addEventListener("mousedown", down, false);
        canvas.addEventListener("touchmove", touch, false);
        return controls;
    }

    function CreateTerrainSurface(surfaceFunction)
    {
        var surfaceGeometry = new THREE.ParametricGeometry(surfaceFunction, 64, 64);
        var material = new THREE.MeshLambertMaterial({color: 0xffbbbb, transparent: true, opacity: 0.8, side: THREE.DoubleSide});
        var surface = new THREE.Mesh(surfaceGeometry, material);
        return surface;
    }
    
    function CreateWorld(surfaceFunction, canvas, cameraPosition, lookat){
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(35,canvas.width/canvas.height,0.1,100);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        camera.lookAt(lookat);
        
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0,0,1);
        camera.add(light);
        scene.add(camera);
        
        var surface = CreateTerrainSurface(surfaceFunction);
        scene.add(surface);
        scene.add(new THREE.AxisHelper(10));
        return [scene, camera, surface];
    }

    function Init(canvas){
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true
            });
            renderer.setClearColor("black");
        }
        catch (e) {
            document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
                    e + "</b></p>";
            return;
        }
        return renderer;
    }

    // Initialize
    var tfunc = new TerrainFunction(data);
    var renderer = Init(canvas);

    var camera_pos = new THREE.Vector3(10, 10, 10),
        lookat = new THREE.Vector3(0, 0, 0);
    var [scene, camera, surface] = CreateWorld(tfunc.getFunction, canvas, camera_pos, lookat);
    var controls = CreateTrackballControls(camera, canvas, render, lookat);

    render();

    this.Add = function(x, y, z){
        tfunc.Add(x, y, z);
    };

    this.Update = function(){
        var new_surface = CreateTerrainSurface(tfunc.getFunction);
        scene.remove(surface);
        scene.add(new_surface);
        surface = new_surface;
        render();
    };
}

