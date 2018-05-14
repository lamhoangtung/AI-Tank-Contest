Server / Observer client / Bot
Bundle version: 1.0.0


REQUIREMENT:
- NodeJS: https://nodejs.org/download/
- Latest Chrome or Firefox.

HOW TO USE:
- You can choose to create your bot using Javascript or C++. Templates are in "Bots" folder.
- To test your bot against another bot, copy them to "Arena" folder, rename as P1 and P2. (*.js or *.exe). After that, run "P1-vs-P2.bat".
- Cross platform is OK (for example, P1.exe vs P2.js)

GAME RULES:
- Please read game rule on the official website.

TECHNICAL MECHANISIM:
- The game actually run at 10 loops per second. You will see it as 60 FPS on the observer, that's just interpolation.
- The map size is 22 x 22. The border of the map is filled with indestructible obstacles to make the boundary.
- Therefore, the actual playable map is 20 x 20, and start from 1 x 1.
- The coordinate of each object is the center point of it.
- The center point of the first playable square is x:1, y:1, on the top left of the screen.
- Tanks, bases, obstacles are squares.
- Tanks and obstacles have the size of 1 unit, while bases have the size of 2 units.
- Bullets are just points. They have no size. Collision occured when the point is inside the square of the object (or pass through the square).
- Collision checking with tank movement follow this rule:
     + Move the tank
	 + If the new position collide with another object
	 + Move the tank back to the previous position.
- Airstrike and EMP area-of-effect are circles. If the center of an object is within the circle, that object get affected.
- When checking whether a base position is within the Airstrike AOE circle, the circle radius get 1 unit bonus.
- Power up spawn randomly on 1 of 3 bridges. If all 3 bridges have existing power up, it won't spawn new one.

Object stats: (all stats can be changed for balance on each new version)
- Normal game duration: 2 minutes (120 seconds or 1200 loops).
- Sudden death duration: 30 seconds (or 300 loops).
(=> Maximum game duration can be 150 seconds.)
- Power up spawn every 30 seconds (300 loops).

- Destructible obstacles HP: 100.
- Main base HP: 300.
- Side base HP: 200.

- Airstrike damage: 60.
- Airstrike AOE radius: 3 unit. (bonus 1 when calculate with bases) (remember, the center of the object must be within the AOE to get affected)
- EMP stun duration: 40 loops or 4 seconds.
- EMP AOE: same as Airstrike.
- Airstrike and EMP will occur after 10 loops since the call command.

- Light tank HP: 80
- Light tank damage per shot: 40
- Light tank cooldown between shot: 20 loops (or 2 seconds)
- Light tank speed: 0.5 unit per loop.
- Light tank bullet speed: 1 unit per loop.
- Medium tank HP: 100
- Medium tank damage per shot: 30
- Medium tank cooldown between shot: 12 loops (or 1.2 seconds)
- Medium tank speed: 0.25 unit per loop.
- Medium tank bullet speed: 1 unit per loop.
- Heavy tank HP: 150
- Heavy tank damage per shot: 8
- Heavy tank cooldown between shot: 2 loops (or 0.2 seconds)
- Heavy tank speed: 0.2 unit per loop.
- Heavy tank bullet speed: 0.8 unit per loop.