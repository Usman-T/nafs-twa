<<<<<<< HEAD
# nafs-twa
Bubblewrap build of Nafs for android
=======
<<<<<<< HEAD
# nafs-twa
Bubblewrap build of Nafs for android
=======
# NAFS

## Getting Started

Written in Next js along with shadcn/ui with tailwindcss. Using Next js form actions for the server side function callings and client and server components for partial and dynamic rendering

## Storage

Using Postgres SQL for the database along with Prisma.js for the type safety. Going to be using docker to create the postgres databases while connection is going to be handled by prisma and prisma only

## Authentication

We'll be using next-auth along with Auth.js to setup the authentication. The steps are simple, first we step up prisma and connet to our database. Then we setup our user table with the data for it.

- Setup the Postgres Database with the credentials
- Add it to the .env
- Form the prisma schema and migration
- Install next-auth and setup the auth.config.ts
- Setup the server actions
- Connect the actions with the form actions

## Authenticaton - UXs

Alright, now the form actions are correctly linked up witht he registration forms and stuff, i think we should now opt to making the Register and Login Pages more user friendly in the UX point of things, doing basic error handling like "unique" constraint errors and stuff

## Dashboard

The UI for the dashboard has been made and is completely static. We need dynanmic rendering now so we need to hit up the server for that
Before making _async calls to the prisma API_ we need to have a proper client and server based setup for our components
The way we do this is that there will be a top level **Server Component** and then lower level **Client Components** which handle interactivity and visual feedbacks like Animations and Gestures

To start with, extract all client side functionality based components into seperate granular components in the dashboard folder inside _components_ folder
Then, make async calls to the Prisma ORM and pass the data through props
Lastly, render and commit the changes to the frontend

## Onboarding

Onboarding component is a client component with roughly 1100 lines of code, it needs to be simplifed by modulizing it into simpler more granular components and then all of them can be merged together
We will be using server actions for the creation and enrollment of challenges as they're far performant
This is will be done in 5 commits:

- Modulize the component
- Convert it into server component
- What if we make it into a server comp, how would the steps communicate with each other?? How would step 3 and 4 know the selected challenge ID? It must be state so "use client" must be used
- Make basic async calls to the ORM
- Form actions of creating a challenge
- Form actions for enrolling a challenge

## Dashboard

User registration and onboarding is now completetly functional. Now we display the data on the user's dashboard one card at a time.

- Use of suspense and displaying of fallback UI
  There will be 4 commits on "dashboard-finalize" branch and then it will be merged. That is the NON-NEGOTIATABLE TASK for today.

## Complete Task

To compelte a task, a user must hold down the button for a set amount of time. This will hit up the API most probably. This has been completed

## Progress Page

On the progress, page we have to map the Dimension Values.

## Features to be Made:

- Complete a day (flow is complete, action is to be instantiated)
- Complet a Challegne (UI is built, the re-enrolment needs to be configured)
- User flows for streak loss
- Guidance Page
  - See Ayah of the Day
  - Tafsir and Tarjuma or ayahs
  - Ayah and Theme Explorer
  - Listen to ayahs
  - Surah Reading page
  - Tafsir Reading page
  - Search Functionality
- Payment Integration
- Flows for non-premium users

We are massively overscoping . The app has NOT EVEN STARTED YET
AHHHHHHHHHHHHHHHHHHHHH

## Today's Tasks:

- The Day Completion button and Flow must be fully functional
- The streak system must be implmeneted
- The UI for the calendar page must be updated
- The corresponding Dashboard element for the calendar must be fixed
- The breaking of streaks must be implemented as well
- UI for spiritual path page must be added as well
- UI for the guidance page must be created too

## Completed Tasks:

- Day completion flow is now functional
- Streak system has been implemented
- Calendar page has been fixed
- Its corresponding page on dashboard is also fixed
- Streaks are now checked once a day when the user visits /challenges
- 

## Complete Day for Streaks:
You can only do complete day once in a day, and it will set a localStorage item witht he current date, the button and task completions will be disabled. A new confirmation screen will be shown before the user completes the day to ensure good work of it

## Complete a Challenge
If current streak === challenge duration, nahhh
If completions are all in consecutive *duration* days then we say "challenge completed enroll in new one"

Nice the UI is made, we just gotta fix up all the steps. We do that one step at a time
Like dont just go ahead and fix every fucking error in there, wire up each and every step one by one
>>>>>>> c60a69b (init)
>>>>>>> d652b22 (init)
