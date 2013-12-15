---
layout: post
title: Introducing ISAAC
date: 2012-04-19 10:30
comments: true
categories: [ISAAC]
---
Four months ago, the very first commit to ISAAC's repository was made. None of the code from that commit has made it into the application we're launching today.

(This post is going to contain much of what's on [ISAAC's landing page](http://isaac.ayulin.net), though that only covers the user-facing half of what ISAAC is. The other half is here.)
#Where We've Been
ISAAC started as an almost entirely different project: an educational tool to teach basic Newtonian mechanics from within a web browser. We began with the intention of using Google's [O3D](http://en.wikipedia.org/wiki/O3D) libraries for graphics, and came up with several scenarios to include in the final result.

We soon realised that our original concept wouldn't be very useful. The scenarios we proposed were simulations of experiments that can already be done in the real world, the results of which could also be better seen in the real world (and not on a computer screen).

While forces, collisions, and momentum are easily demonstrated in simple, everyday experiments, the orbits and movements of bodies in a star system are not so easily visualised. From that realisation, ISAAC as it exists today was born.
# Where We Are
ISAAC is a star system simulator, written in JavaScript, with graphics powered by [Three.js](http://mrdoob.github.com/three.js/). ISAAC does full n-body calculations for gravity, so each and every body in the simulation is affected by the gravity of the others. ISAAC allows you to play with the Gravitational Constant, as well as the masses of each body, to see how orbits are affected.
## Several Things In One
The name ISAAC really belongs to two things, and is used interchangeably here to refer to them.

It refers to the front-end, user-visible part: the interactive Solar System simulation that you can play with right now.

It refers to the back-end, star system simulator: the mesh of Three.js with our (simple) physics engine, allowing custom star systems to be simulated with no additional code required.

We think of the physics components alone as ISAAC Core: the elements running the simulation that can be ripped out from everything else and transplanted into a completely different application. We may be moving ISAAC Core to a separate repository in the future, to make it easier to use in your own apps.
## Using ISAAC
### Playing With Planets
We've launched ISAAC with a model of our own Solar System – all eight planets, the Sun, and Pluto. As mentioned above, you can adjust the Gravitational Constant or the masses of each planet to see how the orbits change and are affected.

The camera starts locked to the Sun, but can be moved between planets by clicking directly on them, or using the drop-down menu on the right. Clicking and dragging the mouse in space pans the camera around, while holding the middle-mouse button and moving the mouse adjusts the zoom level; if your mouse has no middle button, the zoom level can also be adjusted using the slider on the right.

By default, one second in real time is one day in the simulation. If you want to see things move at a quicker rate, open the Simulation Settings menu and adjust the Days Per Second slider there.

ISAAC uses HTML5's requestAnimationFrame and Page Visibility APIs to pause simulation and rendering when it isn't the active tab, and resume when it becomes visible again.
### A Word About Browsers
In theory, ISAAC should work on any browser which supports a few things: HTML5 Web Workers, the Canvas element, and (optionally) WebGL. In practice, things unfortunately aren't that simple.

For the optimal experience, we recommend using Google Chrome to view ISAAC, on a computer which supports WebGL. Because we're using Three.js, we can fallback to its Canvas renderer if your computer doesn't have WebGL support. However, graphical performance is extremely poor with the Canvas renderer – we'll be looking into making optimisations to resolve this.

We've tested ISAAC on Firefox 11, and found that there's an issue causing the simulation to halt when Days Per Second is above 50. We'll be looking into ways to resolve this, and will update this post when a solution is found.

ISAAC loads on Internet Explorer 10 Consumer Preview, but does not function in a state we consider usable.
## Building Worlds
ISAAC is not limited to any one star system. Though we use our Solar System here, ISAAC can easily simulate any other system without the need to change any of the underlying code: just provide some basic specifications, and ISAAC will handle the rest.

Step by step, here's what you need to do (after [grabbing the source code](https://github.com/isaacjs/ISAAC) – ISAAC is released under the MIT License.)

1. Open `isaac_simulation.js`, and take a look at the `startISAAC()` function there.
2. Make a JSON object, with two objects inside it. These two objects should be keyed `config` and `bodies`.
3. Create a key `graphicsEnabled` in the `config` object.
	* If you're using ISAAC as a whole, without any changes to the way graphics are handled, set this key to true.
	* If you're including ISAAC as part of your own application and don't want Three.js to be involved (for any reason), set this key to false. This means you'll be on your own for graphics.
	* Optionally, create a key `scaling` in the `config` object.
		* There are three values you can choose to determine how ISAAC will render the bodies you specify.
			1. `default`: Produces reasonably-sized but not accurately-scaled models. The size of each body is calculated using our own formula (found in the source.)
			2. `linear`: Each body appears 50 times larger than it does in real life. Produces accurate relative sizes, but distances appear shortened as a result – the best balance between realistic and good-looking.
			3. `realistic`: Each body appears at the size it does in real life. Produces accurate sizes and distances, but at the cost of visibility: everything appears very small. (Space is big!)
4. Add JSON objects for each orbital body to the `bodies` object. Key each object with the name of the body.
	* ISAAC uses these objects to create the planets and stars of your system. Here's the data we use to do so.
		1. `texture`: A String pointing to the texture to be used for the body. If left blank, a random colour will be chosen and used.
		1. `name`: The name of the body. If left out, the body will appear as "Default Orbital Body Name" in ISAAC.
		1. `isStar`: Whether or not the body is a Star. We'll make it a light source if it is.
		1. `mass`: The mass of the body in gigagrams. A gigagram is a million kilograms.
		1. `radius`: The radius of the body, in kilometres.
		1. `position`: The X, Y, and Z starting coordinates of the body. We use a right-handed Cartesian coordinate system (Z is up, Y is to the left).
		1. `velocity`: The X, Y, and Z velocity vector components of the body. Again, right-handed coordinates.
5. Call `ISAAC.Simulation.init` from within `startISAAC()`, with the main JSON object as a parameter.

That's it. There're a few more things that you can include, though these are the key bits we need.

To illustrate, here's a snippet of the specifications used to create the Solar System; the full set is in `isaac_simulation.js`. Note that ISAAC populates its interface with bodies in the order that they are defined in the specification, and starts the camera centred on the first body.
<div style="text-align: center;"><img src="/blog/img/ISAAC/041512_0750_Introducing11.png" /></div>

# Where We're Going
For now, there're two concrete things we'd like to do (that is, on top of normal maintenance and bug-fixing).

Firstly, we'll be making another scenario: a way to visualise the [Analemma](http://en.wikipedia.org/wiki/Analemma) from any planet in the Solar System. This may end up as a separate application built on top of ISAAC, instead of being a part of it.

Secondly, we'd like to overhaul the way ISAAC looks and feels. Things can be prettier and smoother, and we'll be looking into ways to make that happen.

# Wrapping Up (For Now)
We hope ISAAC proves to be useful, be it for educational purposes or to satisfy curiosities. Development is by no means complete – we'll continue adding new features and refining what's already there.

(If you missed it earlier, [ISAAC can be accessed here.](http://isaac.ayulin.net/))

# Acknowledgements
ISAAC began as a project for CS1010R Programming Methodology, a project-based module at the National University of Singapore. We'd like to thank our project co-ordinators, Professor Martin Henz, and Srikumar Subramanian, for their support and guidance.

Other credits can be found on ISAAC's [Behind The Scenes page](http://www.ayulin.net/isaac/technical.html).

ISAAC was created by Jerome Cheng and Pallav Shinghal, and is [available under the MIT License](https://github.com/isaacjs/ISAAC).
