ISAAC.Simulation = ISAAC.Simulation || {};

// Takes in JSON to create the simulation objects.
// How to use this method:
// Create a JSON object with two objects within it.
// The first should be keyed "config", with the second keyed "bodies".
// bodies contains several JSON objects, each of which defining a single orbital body.

// config:
// - graphicsEnabled : REQUIRED. Set to false to use only the core simulation layer, true for graphics support.
// - scaling : Determines the equation used to scale planets. Has several values, detailed below.
// --- "default" : Take the base-10 logarithm of radius, square it, then divide by 2. Produces a decent-looking model, but isn't accurate.
// --- "linear" : Each body appears 50 times larger than it is in real life. Relative sizes are accurate, but apparent distances are not.
// --- "realistic" : Each body is the same size it is in real life. Sizes and distances are accurate.

// bodies:
// Note that the key of each JSON body within the bodies object should be unique and distinct.
// Fields each orbital body can have:
// - texture : String pointing to the texture to be used for this body. If left blank, a random colour will be chosen.
// - name : Optional - the name of this body.
// - isStar: Default false. Whether or not this body is a Star.
// - mass : Default 1. The mass of this body in gigagrams.
// - radius : Default 1000. The radius of this body, in kilometres.
// - position : Default [0, 0, 0]. The X, Y, and Z (right-handed, i.e. Z is up, Y is "left") starting coordinates of the body.
// - velocity : Default [0, 0, 0]. The X, Y, and Z (right-handed as above) starting velocities of the body.
// - motionEnabled : Default true. Whether or not this object should move.
// - accelerationEnabled : Default true. Whether or not this object will have acceleration calculated for it.

ISAAC.Simulation.init = function (JSON) {
	// Create the Orbital Body objects.
	ISAAC.Simulation.bodies = [];
	for(var key in JSON.bodies) {
		var curr = new ISAAC.OrbitalBody(JSON.bodies[key]);
		ISAAC.Simulation.bodies.push(curr);

		// Handle graphics, if applicable.
		if(JSON.config.graphicsEnabled) {
			ISAAC.Graphics.createModel(curr, JSON.config.scaling);
		}
	}
}

// Planet positions and velocities taken from JPL's HORIZONS system,
// for April 09, 2012, 00:00:00.0000CT.
ISAAC.Presentation = {};
ISAAC.Presentation.init = function(JSON) {
	// -------------
	// Startup code is found in isaac_simulation.js
	// -------------
	ISAAC.Simulation.init(JSON);

	// Web Worker.
	worker = new Worker('isaac_worker.js');

	// Add everything to the scene.
	for(var i = 0; i < ISAAC.Graphics.models.length; i++) {
		scene.add(ISAAC.Graphics.models[i]);
	}

	if(ISAAC.Graphics.webGLEnabled) {
		for(var i = 0; i < ISAAC.Graphics.lights.length; i++) {
			scene.add(ISAAC.Graphics.lights[i]);
		}
	}
	
	// Render.
	renderer.render(scene, camera);

	// ------ GUI Initialisation ------ //
	var gui = new dat.GUI(
	{ width : 500 }
	);

	// Create the Camera settings.
	gui.add(window, 'cameraDist', 5, 2000).name("Camera Distance").listen();
	
	// Camera Focus drop-down.
	var camFocusObject = {};
	for(var i = 0; i < ISAAC.Graphics.models.length; i++) {
		camFocusObject[ISAAC.Graphics.models[i].name] = ISAAC.Graphics.models[i].number;
	}
	camFocusGUI = gui.add(ISAAC.Config, 'cameraFocus', camFocusObject).name("Camera Focus");
	
	// Create the Simulation Settings folder.
	var simSettings = gui.addFolder("Simulation Settings");
	var upstepDOM = simSettings.add(ISAAC.Config, 'updateStep', 1, 90).step(1).name("Days Per Second").domElement;
	upstepDOM.onmouseover = timestepShow;
	upstepDOM.onmouseout = timestepHide;

	var gcmDOM = simSettings.add(ISAAC.Config, "gravConstMult", 0.1, 10).name("Gravitational Constant Multiplier").domElement;
	gcmDOM.onmouseover = gcmShow;
	gcmDOM.onmouseout = gcmHide;
	
	// Create the Orbital Bodies folder.
	var planetsFolder = gui.addFolder("Orbital Bodies");

	// Create folders for each body.
	for(var i = 0; i < ISAAC.Simulation.bodies.length; i++) {
		var curr = ISAAC.Simulation.bodies[i];
		var folder = planetsFolder.addFolder(curr.name);
		var controller = folder.add(curr.config, "massMult", 0.1, 100).name("Mass Multiplier");
		var bodyDOM = controller.domElement;
		bodyDOM.onmouseover = massMultShow;
		bodyDOM.onmouseout = massMultHide;
	}
	// ------ End of GUI Initialisation ------ //
	
	// ------ FPS Counter (for debug only) ------ //
	stats = new Stats();
	stats.getDomElement().style.position = 'absolute';
	stats.getDomElement().style.left = '0px';
	stats.getDomElement().style.bottom = '0px';
	
	document.body.appendChild( stats.getDomElement() );
	
	setInterval( function () { stats.update(); }, 1000 / 60 );
	// ------ End of FPS Counter ------ //
	
	// Define what to do when we receive a message from the worker.
	worker.addEventListener('message', function (e) {
		var data = e.data.response;
		if(typeof data !== 'undefined') {
			for(var i = 0; i < data.length; i++) {
				// Update our simulation state.
				// We don't just copy the data array to avoid
				// overwriting each object's config.
				ISAAC.Simulation.bodies[i].motion = data[i].motion;
			}
		}
	}, false);

	worker.postMessage({'command' : 'set', 'updateStep' : ISAAC.Config.updateStep, 'gravConstMult' : ISAAC.Config.gravConstMult, 'bodyArray' : ISAAC.Simulation.bodies});
	animUpdate();
	return "Done.";
}