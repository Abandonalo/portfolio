# Chaldene — presentation script

Roughly 10 to 12 minutes at a calm pace. `[CLICK]` marks a build step on the current slide.

---

## 01 · Title

Chaldene is a visual programming tool for scientific image analysis, built at DFKI. My part of it was closing the feedback loop, and that phrase is the whole talk.

The little pipeline behind me is real, by the way. Drag the threshold node and the preview re-renders. Change something, see the result. Hold onto that. Everything for the next ten minutes is about making exactly that possible.

> Delivery note: the threshold node on the title slide is draggable with the mouse. Optional, but it makes the point before you've said it.

---

## 02 · Context

Quickly, the setup.

Ten months, `[CLICK]` as a student research assistant at DFKI, in the Agents and Simulated Reality group. `[CLICK]`

I had both halves of the job. Design first: `[CLICK]` turning research needs into interaction concepts, interface behaviour, and the software architecture underneath. And then building it: `[CLICK]` React on the front, Python on the back, and the messaging between them, inside JupyterLab.

So nothing here was handed off. Every feature you'll see, I followed from the first problem to working code in the system.

---

## 03 · The user

The person I designed for is a domain expert who works with scientific images.

She may not write much code, but she knows exactly what a good result looks like. She can tell whether cells were separated correctly, whether a threshold just ate an important structure, whether a processing step introduced an artefact. That judgment is her expertise.

And she almost never has one image. A single experiment can mean hundreds of cell or tissue images.

So her natural rhythm is: change something, look at it, judge it, go again. The interface has to keep up with that rhythm. That's the bar for everything that follows.

---

## 04 · The first barrier

Without visual programming, image analysis starts with everything except the image.

Before she can look at her own data, she's installing Python, managing environments and dependencies, learning NumPy and scikit-image, translating what she wants to see into code, debugging it, and running it again.

Chaldene had already solved this part before I arrived. Operations live in reusable nodes, and the visual pipeline turns into executable Python underneath.

That's real progress. But removing the code didn't remove the friction. The way you interacted with it still had very little to do with how researchers actually examine images.

---

## 05 · The blindfold stayed

My starting point was a formative user study from earlier in the project. This is the workflow it looked at. `[CLICK]` Three problems kept coming back.

Parameters were still typed in as text. You set a threshold by entering a number and hoping.

Previews were small and static. You could see that an image existed. You couldn't zoom in, pan around, or check the details that actually matter.

And comparison happened outside the tool. Remembering previous states, re-wiring nodes, exporting images to look at them somewhere else.

`[CLICK]` So the code barrier was gone, but the blindfold stayed. The tool showed you an output. It didn't let you investigate it.

> Delivery note: the workflow image is on screen from the start. First click marks the three faults, second click lands the headline.

---

## 06 · One broken loop

At first this looks like three separate usability problems.

`[CLICK]`

But map them onto her workflow and they all land on the same step: See. She can change a value, but the result doesn't come back clearly or quickly enough. If she can't see it, she can't judge it. And if she can't judge it, she doesn't know what to change next.

So the real problem was never better widgets or bigger previews. It was a broken feedback loop. Once I saw it that way, the whole project had a direction.

> Delivery note: the click assembles the loop node by node and the return arc appears severed at the end. Let it finish before the punchline.

---

## 07 · Five rules

I turned the study findings into five rules, grounded in HCI principles, and they guarded every decision after this.

Grab and drag instead of typing numbers. Let the system remember, so the user doesn't have to. Every change becomes visible. Differences should hit the eye, not be reconstructed in your head. And feedback has to arrive fast, because slow feedback breaks the flow almost as badly as none.

The one in the middle is the centre of the whole project. It's the missing step from the last slide.

> Delivery note: the middle rule drops in last on its own, a moment after the other four. Time the last sentence to it.

---

## 08.1 · Manipulate, don't type

First solution: the controls themselves.

Text inputs became controls that match what a parameter means. A threshold is a slider with the number field still beside it. A range sits directly on the histogram, so you cut where the data is. A crop region is a frame you drag, not four coordinates you type.

The pattern in all of them is hybrid: visual control for exploring, the number stays for precision and for the paper.

---

## 08.2 · Every node, one view

Next, inspection. The static preview became a real viewer. Zoom, pan, look closely.

But zoom on its own creates a new problem. You zoom into one node, and now you have to find the same spot again in every other node.

So the viewers are synchronised. Zoom or pan in one node, and every related node follows. The same cell stays in view at every stage of the pipeline. Separate previews start behaving like one connected inspection environment.

---

## 08.3 · Reveal the change

Sometimes two images side by side still aren't enough. A step removes a few small objects, or changes a subtle region, and your eye just doesn't catch it.

So the answer to "what did this node actually do" lives inside the node. Toggle Diff, and the map marks exactly the pixels that changed. One glance.

---

## 08.4 · Design for the series

And remember, she never has just one image. Experiments come as series, dozens or hundreds of files.

The original workflow treated images as individual inputs. I designed a batch interface, so an operation runs on the whole collection instead of one file at a time.

---

## 09 · They asked for a tree

The biggest design change came from mid-project feedback. Users asked for the results of a parameter search to be shown as a collapsible tree.

I took the request seriously. Not literally.

A tree works when the search has one main direction. With three or more parameters, the branches stop being readable. And more importantly, she doesn't need to understand the hierarchy. She needs to see which result looks best. `[CLICK]`

So the tree became a gallery. Every parameter combination is rendered as an image, side by side, and you pick with your eyes. `[CLICK]`

This is what shipped. Zoom and pan are synchronised here too, and the winning result goes straight back into the pipeline with one click.

> Delivery note: on entry, "They Asked For a Tree" over the tree sketch. Click 1 brings in "They Needed a Gallery" with the gallery sketch beside it. Click 2 grows the real interface.

---

## 10 · More previews, less wait

All this visual richness has a cost. More previews means more image data, and if feedback turns slow, the whole concept collapses.

`[CLICK]` Here's the obvious delivery path. The frontend receives a link, then has to make a second request to fetch the actual image. Two trips for every preview.

`[CLICK]` I changed it so the preview travels inside the message the frontend already gets. One trip. And a pipeline is full of previews, so that saving repeats constantly.

On top of that, rendering happens on a canvas in the browser. Once an image has arrived, zooming and panning are local, so looking around never waits for the backend.

> Delivery note: each click races one bar across; the verdict label lands when the bar finishes. Talk over the first bar, pause for the second.

---

## 11 · The loop is closed

Put together, these changes restore the missing step. `[CLICK]`

Change a parameter with a direct control. See it immediately. Understand it in context. Go again. The loop turns.

`[CLICK]` Before, working in this tool meant type, run, guess, and remember. Now it's tune, inspect, compare, repeat.

---

## 12 · Two lessons

Two lessons stayed with me.

`[CLICK]` Feedback is how users understand a system. A tool can perform exactly the right operation, but if it doesn't show the result clearly, people still can't make confident decisions.

`[CLICK]` And UX has to perform and scale. A beautiful image viewer is useless if every interaction lags. An interface built for one image doesn't solve a task with hundreds. You have to design the interaction, the performance, and the data scale together.

---

## 13 · Next time

The honest limitation of my process is evaluation.

There was a formative study at the start, and I collected quick, informal feedback the whole way through. What I can't tell you is how much better the finished system actually is.

`[CLICK]` Next time, I'd measure a baseline before redesigning, then repeat the same tasks afterwards. Task completion time first, and accuracy and usability alongside it. Then I could show not just that it feels better, but by how much.

`[CLICK]` Thank you. I'm happy to take questions.

---

## Click count check

| Slide | Clicks the deck expects |
|---|---|
| 01 Title | 0 (threshold node is draggable, optional) |
| 02 Context | 4 |
| 03–04 | 0 |
| 05 The blindfold stayed | 2 |
| 06 One broken loop | 1 |
| 07 Five rules | 0 (middle rule lands last on its own) |
| 08.1–08.4 Solutions | 0 |
| 09 They asked for a tree | 2 |
| 10 More previews, less wait | 2 |
| 11 The loop is closed | 2 |
| 12 Two lessons | 2 |
| 13 Next time | 2 |
