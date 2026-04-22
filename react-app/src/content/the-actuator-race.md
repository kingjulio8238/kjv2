A humanoid robot is a collection of joints, each driven by an actuator. Most are **rotary actuators** - a brushless motor, a precision reducer, an encoder, a torque sensor, a set of bearings, and the firmware that binds them. Where a degree of freedom slides or extends in a line rather than turns, a **linear actuator** does the work - typically a motor, a ball or planetary roller screw, position or force sensing, and firmware on its own control loop. Every step the robot takes, every object it lifts, every gesture it makes runs through those modules. Tesla has publicly stated that **actuators account for roughly 56% of the Optimus bill of materials**, and Boston Dynamics now puts the actuator share of Atlas's material cost at **more than 60%**.

**The United States builds almost none of it.**

On the software side, American humanoid robotics is in strong shape: compute, models, and embedded firmware. NVIDIA supplies 54% of the field. The leading VLAs are largely US work. The tooling for controls and simulation skews US as well. The stack that decides *what* to do is US domestic.

The hardware that does the doing ie. the actuators themselves mostly is not. The US imports that layer. The rest of this piece is about why, and what it would take to build a real actuator domestic industry.

## What's Actually Inside an Actuator

Open a humanoid joint and you don't find a motor. You find a module. Most of the degrees of freedom in a humanoid are driven by a **rotary actuator**. A handful of joints concentrated in the knees, ankles, and sometimes the waist of a bipedal robot use a **linear actuator** instead. Both follow the same pattern: motor, transmission, sensing, bearings, housing, firmware. The geometry changes. The cost structure changes. The underlying industrial problem does not.

### The Rotary Actuator

Typically 7 parts in 1 housing:

- **BLDC motor:** frameless brushless torque motor, turns current into rotation
- **Reducer:** strain-wave (harmonic) gear, trades speed for torque near 100:1 with near-zero backlash
- **Encoder:** reads angular position to sub-arcminute precision.
- **Torque sensor:** measures applied force, enabling compliant, force-controlled motion
- **Bearings:** cross-roller bearings that take axial and radial loads in one compact race
- **Housing**: the structural shell that ties everything to the skeleton
- **Firmware:** embedded control loop running current, velocity, and impedance at kilohertz rates

Cost breakdown for a humanoid-grade rotary actuator: **reducer ~36%, torque sensor ~30%, motor ~13.5%**, with the balance in bearings, encoder, housing, and firmware.

### The Linear Actuator

6 parts. The rotary transmission gets replaced with a screw; the cost still concentrates in the transmission:

- **BLDC motor:** same frameless torque motor, sometimes with a small rotary reduction stage upstream
- **Planetary roller screw:** a threaded shaft wrapped in a cage of grooved rollers. Converts motor rotation into linear force through rolling contact rather than sliding. Rated for millions of cycles under dynamic load (~100 million is solid aim)
- **Linear guide / bearings:** keeps motion on a single axis and reacts to side loads and moments so the screw sees mostly axial force
- **Position sensor and load cell:** measures travel and applied force
- **Housing:** typically a telescoping tube that carries the output force directly through its own structure
- **Firmware:** the same kilohertz-rate control loop, tuned for linear force control rather than angular torque

**The money still sits in the transmission:** the screw assembly is usually the largest line on the BOM - in the same ballpark as a strain-wave stack in a rotary module, and often larger Humanoid-grade planetary roller screws require multi-axis precision grinding which means the global pool of qualified suppliers runs to the low single digits.

**Tesla Optimus reportedly uses 20 rotary plus 14 linear actuators.** The linear ones concentrated in the legs, where they deliver the force density walking under load requires. Figure 03 and Apptronik Apollo use both types. Boston Dynamics Atlas leans heavily on linear designs in the lower body. Unitree's G1 is more rotary-dominant with short linear sections.

The shared punchline holds across both designs:

**The motor is not the expensive part. The transmission is.**

For rotary actuators, that transmission is a strain-wave reducer. For linear actuators, it's a planetary roller screw. Both are precision-manufacturing problems the US does not currently solve at scale. "Reshoring motors" reshores the cheap eighth of either design. The hard parts, the reducer and the screw, are what the following sections are actually about.

## The Chinese Off-the-Shelf Ecosystem

China runs a different play. **Chinese OEMs treat the actuator as a purchased component. Western OEMs treat it as a custom in-house engineering program.**

Unitree, AgiBot, EngineAI, XPeng, Fourier, UBTECH, Kepler, MagicLab - none of them custom-engineer their actuators. They buy complete plug-and-play modules for both the rotary joints and the linear leg stages, bolt them into the kinematic chain, and ship. The domestic supplier base does the hard part.

On the rotary side:

- **CubeMars:** AK Series robotic actuators, fully integrated motor + gearbox + driver rotary modules. The AK10-9 V3.0 delivers 18 Nm rated and 53 Nm peak through a 9:1 planetary reducer. The AK45-36 pushes torque density over 70 Nm/kg through a 36:1 gearbox at 340 grams compact enough for humanoid wrists. Supplies Unitree, AgiBot, and EngineAI
- **Leaderdrive:** Suzhou-based harmonic reducer maker. Builds the rotary-actuator transmission that sits inside most Chinese joint modules. Leaderdrive is China's domestic answer to Japan's Harmonic Drive Systems at a fraction of the cost. They ship strain-wave gears into Unitree, Fourier, Kepler, MagicLab, and AgiBot. One of the core reason Unitree's BOM clears the $12K floor
- **Estun Automation:** integrates servo motors into four Chinese humanoid OEMs
- **Moons' Electric:** servo motors to XPeng and UBTECH. 16mm coreless units with competitive torque density

On the linear side:

- **Nanjing KGM:** planetary roller screws into the linear actuators powering Unitree, AgiBot, XPeng, and EngineAI hips, knees, and ankles. The global roller-screw market is a $1.8B category growing 30%+ CAGR, and China is racing to own it. Capacity inside China is younger than the rotary-reducer stack but catching up as multiple firms add dedicated planetary-roller-screw lines for humanoid demand

- **Rollvis:** the Swiss incumbent in high-precision planetary roller screws is also a key supplier to Western humanoid programs.

The result is compounding scale across both actuator types. TrendForce projects **Unitree and AgiBot alone will take ~80% of China's 2026 humanoid shipments**, with China's total humanoid output surging **94% YoY**. That volume is only possible because no Chinese OEM is stuck bringing up a bespoke rotary *or* linear actuator program from zero.

## The Western Pattern

Western humanoid programs don't buy actuator modules. They buy subcomponents and custom-integrate their own actuators in-house.

The subcomponent stack is almost entirely European and Japanese. Shared across both actuator types:

- **Maxon:** frameless BLDC motors used in both rotary joints and linear-actuator drives for Boston Dynamics Atlas and Apptronik Apollo (CH, 25–30% market share)
- **Kollmorgen:** frameless servo motors for Figure 03 and Agility Digit, across rotary and linear actuators alike. The rare American name on this list with 15–20% market share
- **Nidec:** frameless and coreless motors for Tesla Optimus, supplying both the 20 rotary and 14 linear actuators in the design (Japanese)

On the rotary-actuator side, the transmission that most humanoid joints run through:

- **Harmonic Drive Systems:** strain-wave reducers across 13+ OEMs including Tesla, Apptronik, Figure, Unitree, UBTECH. ~36% of rotary actuator BOM (Japanese)
- **Nabtesco:** cycloidal reducers for rotary actuators at Boston Dynamics and Agility Robotics (Japanese)
- **THK and NSK:** cross-roller bearings for hip, waist, and shoulder rotary joints across Tesla, Apptronik, Figure (Japanese)

On the linear-actuator side, here's what carries the robot's weight in the legs:

- **Rollvis** (CH) and **Ewellix** (DE, Schaeffler-owned): planetary roller screws for the linear actuators inside Tesla, Apptronik, Figure, Boston Dynamics, and Agility legs
- **THK and NSK:** linear guides and bearing packs that keep those screw-driven stages on-axis under dynamic side load (both Japanese)
- **Load cells:** specified in-house by each OEM, typically sourced from HBM (DE) or ATI Industrial (US)

Every Western OEM ships a **custom-integrated actuator** because no Western off-the-shelf humanoid-spec module exists at reasonable price levels. The cost of that choice is real: engineering headcount burned on mechanical integration, slower iteration, and a permanent dependency on offshore subcomponent supply.

And then there's the reveal.

Boston Dynamics Atlas, the current electric generation and arguably the most iconic American humanoid **runs on actuators supplied by Hyundai Mobis, a Korean automotive tier-1.** Announced at CES 2026. Mobis supplies the full actuator module, plus grippers, perception modules, head modules, controllers, and battery packs. Actuators alone represent more than 60% of Atlas's material cost.

The silver lining: Hyundai is investing $26B in US operations through 2028, including a Robotics Innovation Hub in Savannah, Georgia targeting 30,000 Atlas units per year. Korean-designed, US-assembled.

Call that what it is. This is the closest thing to a "domestic" American humanoid actuator manufacturing facility while the IP, the engineering authority, and the parent company are all offshore.

## What Building Actuators in America Actually Requires

The real work is a single dependency chain covering magnets, motors, precision mechanicals that serves both rotary and linear builds.

On magnets, MP is adding US separation, Fort Worth Stage 3, and a ~2028 Northlake campus, while China still refines most of the world's rare-earth oxides (about 85%). The gap to close is refining and finished metal.

On frameless BLDCs, the two best-known high-end options are Kollmorgen (US) and TQ RoboDrive (DE). Allient is in the field but not yet at humanoid spec. The US still needs a second joint-qualified **domestic** motor vendor.

The rotary transmission is the first main bottleneck: there is no US strain-wave line at true humanoid scale. Harmonic Drive Systems in Japan sets the bar, GAM in the US is not there yet and only about 12% of global machine-tool makers can hold the required grinding tolerances. Most of the BOM and most of the geopolitical risk sit in that gap.

After that come linear guides and cross-roller races to qualify (THK and NSK at scale; Timken the nearest US name on a crossed-roller line), torque and load sensing with HBM, Kistler, and ATI in the global mix, and encoders where ADI and TI have silicon but Renishaw and Heidenhain own the high-end.

**The US is ahead on models and compute. Metals, gears, roller screws, races, and the force path through the leg are another problem entirely.**

## Own the Muscle

Owning the brain is necessary. Owning the muscle is what separates a demo industry from a shipping industry.

In 2026, the US owns the brain. China owns the muscle - rotary *and* linear. Japan and Switzerland own what sits in between. Korea builds the actuators that ship inside Atlas.

None of this is unsolvable. All of it requires capital, policy, and a decade of focused investment. Mining needs refining. Motors need a second qualified vendor. Reducers need a greenfield precision-grinding industry the US has not possessed in thirty years. Roller screws need a domestic producer from ground up. Bearings and linear guides need qualification. Torque sensors and load cells need an entrant.

The Chinese humanoid industry is not waiting. Unitree and AgiBot together are projected to ship 80% of the world's humanoids in 2026. Every quarter the US spends debating whether it needs an actuator industry is a quarter China spends building one.

**The actuator race has started. The US needs to start sprinting.**

Explore the full humanoid supply chain on [Humanoid Atlas](https://humanoids.fyi).
