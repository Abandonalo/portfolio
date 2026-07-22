# GoodGo — presentation script

Roughly 9 to 11 minutes at a calm pace. `[CLICK]` marks a build step on the current slide.

---

## 01 · Title

GoodGo is a navigation concept for wheelchair users.

The idea behind it is simple. If you use a wheelchair, accessibility information shouldn't be buried three menus deep. It should be there at the moment you need it.

The line behind me is a route. Watch what happens when I break one thing on it. A ramp. `[CLICK]` An elevator. `[CLICK]` An accessible toilet. `[CLICK]`

One broken link and the whole trip is off. That's the problem in one picture.

> Delivery note: these three are the round buttons on the route. Click them directly with the mouse. They toggle, so click again to reset before you move on.

---

## 02 · Project snapshot

Quickly, where this came from.

Two months. `[CLICK]` Two people. `[CLICK]`

I led most of it and stayed with it the whole way through. Research and problem definition first, `[CLICK]` then user flows, wireframes, and the final screens. `[CLICK]`

That end-to-end part is why I keep coming back to this project. I got to watch what happens to a research finding by the time it turns into a button.

---

## 03 · Problem scenario

Let me introduce someone. `[CLICK]`

She uses a wheelchair, and she's planning an ordinary day. Four stops. Nothing unusual about any of them.

Half past eight, she's on her way to university. The route is smooth, she's making good time, she's thinking this is a good day. Then she reaches the building. `[CLICK]` The elevator is out of order. Her class is on the fifth floor, and there was no way to know before she got there. She misses the lecture and asks a classmate for the notes.

She's frustrated now, and a migraine is starting, so she looks for a pharmacy. Google Maps, walking mode. She follows it. `[CLICK]` The route ends at a curb she can't get up. So she goes the long way round, which costs her energy she doesn't have.

By this point she just wants to sit down somewhere. There's a café nearby. `[CLICK]` But the listing says nothing about the entrance and nothing about the toilet. Can she get in? Can she stay? She doesn't know, and she's not in the mood to gamble twice in one day.

So, home. Subway. Most stations have a lift these days. `[CLICK]` This one doesn't.

Four stops. `[CLICK]` Four completely ordinary destinations. And every one of them held something she couldn't find out in advance.

That's the part I want to stress. This isn't a dramatic day. This is a Tuesday.

---

## 04 · Pain point

So how does she avoid all of that? She does the work herself, before she leaves the house.

A map app for the route. `[CLICK]`
A specialist accessibility app for the facilities on the way. `[CLICK]`
A transport app to arrange help with the platform lift. `[CLICK]`
A search for the destination. `[CLICK]`
And then, often, a phone call to the venue to check what she just read. `[CLICK]`

Five sources. Every one of them adds information. Not one of them adds certainty. She can do all of that and still not know whether the trip holds together.

---

## 05 · Research

That scenario isn't invented. It comes out of about eighty responses to an online survey, plus interviews with wheelchair users.

Three findings shaped everything after this.

First, there's no single good source. People fall back on web searches, or on asking other people, rather than using any dedicated service.

Second, bathrooms. Accessible bathroom information was asked for more than anything else, ahead of sidewalks and entrances.

Third, and this one surprised me: community participation scored eight point six out of ten. People didn't only want to receive this information. They wanted to add to it.

---

## 06 · Surprising finding

One answer changed our direction completely.

We came in assuming the problem was missing information, so our instinct was to collect more and show more.

The survey pointed at something worse. The real damage isn't a blank space. It's a place marked accessible that turns out not to be. The lift that's broken. The entrance that's too narrow.

Because that doesn't just fail you. It talked you into leaving the house. And once that's happened, you stop trusting that entry, and you stop trusting the app that gave it to you.

So the goal moved. Not just show accessibility information. Keep it honest.

---

## 07 · What users need

I turned those findings into four needs.

Enough detail to judge whether a place works for your body, not for an average body. Information accurate enough to actually decide on. One journey, start to finish, in one place. And an easy way to give back what you learned along the way.

Underneath all four is the same thing. The goal isn't to label more places accessible. It's for someone to leave the house believing the trip will work.

---

## 08 · Competitive audit

Before designing anything, I looked at two products that already exist.

Wheelmap does place information well. Ratings, photos, you can add new places yourself. But when you actually want to go somewhere, it hands you off to a different map app. And there's no real room for discussion.

Rong Chang covers navigation and a lot of travel information. But the interface is crowded, the accessibility details often aren't specific enough, and there's no review system, so the operator maintains all of it alone.

Three decisions came out of that. `[CLICK]`

One journey instead of two apps. Essentials first, detail on demand. And a much stronger contribution loop: status, reviews, reporting, maybe rewards.

Let me show you what that turned into.

---

## 09 · Decision one, integration

The first decision was not to build another specialist app.

Another download, another interface to learn, another thing to remember to check. So instead I put the accessibility focus inside a map people already have on their phone and already know how to use.

On the start screen, these shortcut tabs go straight to what people actually search for. Accessible toilets, elevators, ramps. Where you put something says what an app is for, and these are at the top.

And when a journey starts, there's a wheeling mode. Not walking with a few adjustments. Its own mode, with the facilities and the barriers marked along the route.

---

## 10 · Decision two, effort

Second decision: rethink what makes a route good.

Almost every navigation app optimises for time or distance. But the shortest route is not the easiest route to wheel. A longer way round can cost far less energy if it avoids a steep slope, a rough surface, a bad crossing.

So the preferences here include wheeling distance, wheel intensity, and accessible parking. The question stops being how fast is this. It becomes: can I actually do this today.

---

## 11 · Decision three, layered depth

Third: how much to show at once.

The survey said people need detail. The audit showed what happens when you give them all of it on one screen.

So the information sits in two layers. The first is the accessibility rating, enough to tell at a glance whether a place is even worth considering. The second opens the specifics: entrance width, step-free access, the bathroom.

Not buried three taps down. And not everything shouting at you at the same time.

---

## 12 · Decision four, trust

Fourth: trust.

Accessibility isn't a fact you record once and file away. A ramp gets blocked. A lift breaks. Construction closes a route that worked last week.

So two things work together here. Live status tells you whether a facility is usable right now. And reporting makes it fast to flag what's wrong: bad information, steps, rough ground, something in the way.

That takes maintenance off a single operator and spreads it across the people who are already standing there. And going back to the survey, that's something people said they wanted to do.

---

## 13 · Impact and lessons

What came out of it is one continuous experience: the route, the destination, the facilities, and the community around them. Our professor rated it highly.

There was one deliberate trade-off. `[CLICK]`

GoodGo borrows heavily from Google Maps instead of inventing its own visual language. That was on purpose. If someone already knows where things are, they're not learning an interface while trying to get somewhere.

And four things I'm taking with me. `[CLICK]`

Make the important need the entry point, not a filter. Design around the real cost, which here is effort rather than minutes. Layer the depth. And spread the maintenance instead of leaving all of it to the operator.

---

## 14 · Reflection

The honest limitation is that we never tested the finished prototype with a wheelchair user on a real planned route.

Asking people got us to a direction. Only testing would have told us whether that direction actually holds. That's the first thing I'd add.

---

## 15 · The gap

There's one gap I want to name rather than quietly skip.

In our survey, the most reported frustration wasn't bathrooms or ramps. `[CLICK]` It was transport.

That might not be obvious from here. But think about China, where I'm from. Buses often can't take a wheelchair at all, so taxis carry much more of the load. When you can't call one that fits, that isn't an inconvenience. That's the trip cancelled.

So accessible taxis should be their own travel mode. `[CLICK]` And the entry point is there, in the tabs.

What happens after you tap it, we never designed. `[CLICK]` That is exactly where two months ran out. `[CLICK]`

Thank you. I'm happy to take questions.

---

## Click count check

| Slide | Clicks the deck expects |
|---|---|
| 01 Title | 3 route stops, clicked directly (they toggle) |
| 02 Snapshot | 4 |
| 03 Scenario | 6 |
| 04 Pain point | 5 |
| 05–07 | 0 |
| 08 Audit | 1 |
| 09–12 Decisions | 0 |
| 13 Impact | 2 |
| 14 Reflection | 0 |
| 15 Gap | 4 |
