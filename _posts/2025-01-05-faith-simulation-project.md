---
layout: post
title: "Faith Simulation Project Idea and Data Model"
date: 2025-01-05
tags: ai chatbot faith simulation django data-modeling
---

## Introduction
•	Hook: Start with an engaging question, anecdote, or statement that connects the reader to your inspiration for the project.
•	Context: Briefly describe the origin of the idea. What inspired you to start this project?
•	Preview: Give a quick overview of what the post will cover (e.g., the idea, how you tackled it, challenges, results, and takeaways).

## The Idea

I started the data modeling exercise, hoping to turn it into a simulation game (I'm in the middle of reading [Building SimCity: How to Put the World in a Machine](https://direct.mit.edu/books/monograph/5791/Building-SimCityHow-to-Put-the-World-in-a-Machine))

I've been reading [Building SimCity: How to Put the World in a Machine](https://direct.mit.edu/books/monograph/5791/Building-SimCityHow-to-Put-the-World-in-a-Machine) and found myself wanting to build a simulation game.

There are simulations for everything out there, but I wanted to work on one that is personal to me and my interests.

I Also am more interested in the data-modeling side, and less interested in animation / graphics / etc.  So I wanted to focus on that.  And use tools i'm familiar with (Django, SQL, etc)

What this ended up looking like was a data model for simulating the relationships and histories of religions and faiths.

I found the idea compelling because it explores the complexity of human relationships with belief systems, organizations, and communities, and how these evolve over time.

## The Result

I did not spend a lot of time on this project, but I did get a good start on the data model.  If I feel inspired later, I may work on an actual UI / game / simulation.  For now I mainly wanted to have fun data-modeling, and also blogging / writing down my thoughts.

The model includes entities such as individuals, doctrines (abstract ideas or principles), organizations, faiths (systems of doctrines), and locations.

Relationships between these entities are expressed using join tables, allowing for attributes like sentiment (e.g., strongly agree/disagree) or weight (e.g., importance). The project aims to track dynamic relationships, sentiments, and historical changes across all entities, leveraging tools like django-simple-history for versioning and centralized logging for unified insights into changes across all models.

The focus is on designing a flexible, scalable data model that prioritizes:

- Key entities (individuals, doctrines, organizations, faiths, locations).
- Dynamic relationships (e.g., individual alignment with doctrines, organizational affiliation).
- Historical tracking of changes across entities using django-simple-history.

## The Process

#### Initial Concept

My initial stab at the data model was pretty close to how it would look in the end.  (as i had been mulling on this for a few days)

I knew I wanted to simulate the following:

- Religions

For obvious reasons - this is the core of the simulation.

I decided to rename to `Faith` as it was more generic, and could encompass things like cults, sects, etc.

- Individual People

This was to keep the simulation as realistic and interesting as possible.  Rather than having something like "number_of_followers" ; I knew that a single person could have multiple beliefs, and could be a member of multiple organizations.  I also wanted to track their sentiment towards each belief, and each organization.

I landed on `Individual` as the entity name, as it was the most generic term that could be used to describe a person.  (and not have the annoying `Person` -> `People` pluralization issue)

- Beliefs

This is b/c I wanted to have a way to track the beliefs of an individual, and the beliefs of a religion.  As an individual could have a belief that is not part of their religion, and a religion could have beliefs that are not held by all of its followers.

I landed on `Doctrine` as the entity name

- Churches

This is a group of people, which would follow a religion.  And churches can have written doctrines & members.  There may also be multiple churches for a single religion.  And multiple religions could share a church.  And a church could have multiple locations.

Landed on `Organization` and `Location` as two entities, to represent this.

- Events / History

What makes faiths/religions interesting is how they evolve over time.  Same w/ individuals.  So I wanted to track events that would change the relationships between these entities.

### Tools & Setup

I started with Django models, as that's is my go-to framework for web development.  And by extension, SQL / relational databases.

However, I wanted to have more flexible visual representation of the data model, and began to see this was more an exercise in data-modeling, rather than writing actual application code. So I took a step back from writing python. writing as [PlantUML](https://plantuml.com/) diagrams.  I like PlantUML / text-based diagramming, b/c  A) I'm a keyboard guy B) it's easy to version control C) it's easy to send to/from AI chat.

Also part of this, is an exercise in what i can do with AI chatbots / how to leverage them for my own productivity.

So, for each step, i copied my question and the answer from the AI chatbot, and created a new markdown file.  I then altered/modified/copied back into the chat, and repeated the process.  (note - i'm following a similar process in this file, wrapping my ai chats in `<details>` tags, so i can track / easily copy/paste/modify the responses - and also for the reader to see the process & have some transparency)

```
$ ls docs/chatlog/
0001_initial.md
0002_join_tables.md
0003_faith_relationships.md
0004_faith_v_religion.md
0005_belief_concept_individual_sentiment.md
0006_a_step_back.md
0007_individual_locations.md
0008_events.md
```

See (todo; link to github repo) for the full chatlog and my process here.

### Challenges
	•	Complexity vs. Simplicity: Struggled to balance a flexible model with the simplicity needed for efficient queries and management.
	•	Event Tracking: Debated multiple approaches (e.g., SQL views, polymorphic tables) to create a unified history log across models, each with its pros and cons.
	•	Dynamic Relationships: Capturing nuanced relationships (e.g., individual sentiment toward doctrines) while avoiding redundancy was a key challenge.
	•	Inspiration from SimCity: Translating ideas from the book into practical design choices required careful thought about scalability and realism.


### Final Result

I ended up with the following data model:

<!-- <img src="/assets/images/github.png" alt="GitHub" height="24" width="24"> -->
[PlantUML Diagram](/assets/images/faith_simulation_data_model.png)

(todo: link to github repo)

#### Join Tables w/ Sentiment & Weight

The solution I landed on was to use join tables to represent relationships between entities.  And to include a `sentiment` field on these join tables, to represent the strength of the relationship.

Ex: `IndividualDoctrine`, `OrganizationDoctrine`, `FaithDoctrine` to represent the intertangling of beliefs between individuals, their organizations, and those organization's faiths/religions.

and the `sentiment` field on each of these tables would be `[strongly agree, agree, neutral, disagree, strongly disagree]` represented as `[-2, -1, 0, 1, 2]` in the database.  (as an organization may founded on what they "strongly disagree" with, than what they "strongly agree" with)

and teh `weight` field would be a float, representing the importance of the relationship.  (rather than sentiment, the assumption is that it would only represent if an individual belongs to an organization, not if they disagree with it)  and it would represent that an individual could belong to multiple organizations, and the weight would represent the importance of each organization to the individual.

#### Event Tracking

Not shown here, but would have a "history" table for every table - so any changes would be traceable (thought to use `django-simple-history` which does this automatically -- if it wasn't so easy, I might have said it was excessive).  And would have a centralized logging table to track all changes across all models.

```python
from simple_history.signals import post_create_historical_record

def log_change(sender, instance, history_instance, **kwargs):
    Event.objects.create(
        model_name=sender.__name__,
        object_id=history_instance.id,
        change_type=history_instance.history_type,
        change_date=history_instance.history_date,
        changes=history_instance.diff_against(instance.previous_version).changes
    )

post_create_historical_record.connect(log_change)
```

## Reflection & Next Steps

I'm happy with the data model I came up with, and feel like it's a good start for a simulation game.  I'm not sure if I'll continue with this project, but I'm glad I took the time to work on it.

The next steps would be to build out the actual simulation, and to add a UI to interact with the data model.  I would also like to add more advanced analytics and visualizations to track the changes over time.

even if i don't work on the actual project, i had fun data-modeling, and writing this blog post.  And I hope you enjoyed reading it!

---

## Behind the Scenes

In addition to using AI to help me think through the data model, I also used AI to help me write this blog post.  Some of my queries and responses are included below, to provide some insight and transparency into my process.

What is _not_ shown (and no idea how it _would_ be) is that I write using my editor and GitHub Copilot, which is essentially quite advanced auto-completion, so some of what is written wasn't typed by me, though it was worked through line-by-line.

<details>
<summary>what are the best ways to outline a blog post going over a project idea i had and worked on for a few hours?</summary>

Outlining a blog post about a project idea you had and worked on for a few hours should balance personal storytelling with actionable insights. Here’s a structured approach to outline your post:

1. Introduction
    •	Hook: Start with an engaging question, anecdote, or statement that connects the reader to your inspiration for the project.
    •	Context: Briefly describe the origin of the idea. What inspired you to start this project?
    •	Preview: Give a quick overview of what the post will cover (e.g., the idea, how you tackled it, challenges, results, and takeaways).

2. The Idea
    •	What: Describe the idea in detail. What problem does it aim to solve, or what opportunity does it explore?
    •	Why: Explain why you found this idea compelling. Why was it worth a few hours of your time?
    •	Scope: Define the limits you set for yourself in this project.

3. The Process
    •	Tools & Setup: Mention the tools, frameworks, or resources you used and why you chose them.
    •	Steps Taken: Outline the major steps you followed to bring the idea to life.
    •	Example:
    1.	Brainstormed features.
    2.	Created a quick prototype.
    3.	Tested functionality.
    •	Challenges: Highlight any roadblocks or surprising discoveries along the way.
    •	Time Spent: Briefly discuss how much time you dedicated and how you managed it.

4. The Result
    •	Outcome: Share what you built, even if it’s incomplete or a proof of concept.
    •	Demo or Visuals: If possible, include screenshots, code snippets, or even a short video to show off your work.
    •	Unexpected Insights: Talk about anything you learned or realized that wasn’t part of the original plan.

5. Reflection
    •	What Worked: Discuss what went well and what you’re proud of.
    •	What Didn’t: Be honest about the limitations or aspects that didn’t meet your expectations.
    •	Lessons Learned: Share the takeaways that could help others attempting similar projects.

6. Next Steps
    •	Future Possibilities: If you were to expand this project, what would you add or change?
    •	Opportunities for Others: Invite readers to contribute, improve, or adapt the idea.

7. Conclusion
    •	Recap: Summarize the journey in one or two sentences.
    •	Call to Action: Encourage readers to try something similar, share feedback, or discuss related ideas.

8. Optional Extras
    •	Links: Provide links to tools, repositories, or resources you mentioned.
    •	Code: Include a GitHub link or embed code snippets for readers to explore.
    •	Credits: Acknowledge any resources or inspirations.

This structure ensures your blog post is engaging, informative, and useful for readers while showcasing your creativity and effort.

</details>


<details>
    <summary>This is what i have so far: ... I'd like you to fill out the following: ...</summary>

The Process

Tools & Setup
	•	Tools:
	•	Django: Chosen for its robust ORM, which simplifies data modeling and relationship management.
	•	django-simple-history: Selected for tracking historical changes in model data, allowing for versioning and audits.
	•	PlantUML: Used for creating clear and concise UML diagrams to visualize the data model and relationships.
	•	Python: Core programming language for the backend due to familiarity and its synergy with Django.
	•	PostgreSQL: Database chosen for its support of advanced features like JSON fields and views, enabling flexible queries.
	•	MIT Press Book on SimCity: Inspiration for structuring complex simulations and dynamic systems.

Steps Taken
	1.	Brainstormed Features:
	•	Identified key entities (e.g., individuals, doctrines, organizations, faiths, locations) and their relationships.
	•	Discussed the need for attributes like sentiment and weight in join tables to capture dynamic relationships.
	2.	Designed Initial Data Model:
	•	Created UML diagrams to visualize core entities and their relationships.
	•	Focused on simplicity and flexibility, keeping attributes to a minimum in the early stages.
	3.	Integrated Historical Tracking:
	•	Chose django-simple-history for tracking changes and ensuring data integrity over time.
	•	Discussed options for centralized change logs across all models.
	4.	Explored Unified Event Tracking:
	•	Considered various methods (SQL views, centralized logging tables, dynamic aggregation) for aggregating history across models.
	5.	Refined the Model:
	•	Iteratively updated the data model based on feedback and discussions, balancing complexity and scalability.
	•	Added join table attributes like sentiment and weight to enrich relationships.

Challenges
	•	Complexity vs. Simplicity: Struggled to balance a flexible model with the simplicity needed for efficient queries and management.
	•	Event Tracking: Debated multiple approaches (e.g., SQL views, polymorphic tables) to create a unified history log across models, each with its pros and cons.
	•	Dynamic Relationships: Capturing nuanced relationships (e.g., individual sentiment toward doctrines) while avoiding redundancy was a key challenge.
	•	Inspiration from SimCity: Translating ideas from the book into practical design choices required careful thought about scalability and realism.

Time Spent
	•	Brainstorming and Research: ~3 hours, including reading and exploring simulation-based inspirations.
	•	Data Modeling: ~4-5 hours, iterating through different designs and UML diagrams.
	•	Historical Tracking Discussions: ~2 hours, evaluating tools and strategies for tracking changes across models.
	•	Total Time: ~10-12 hours so far, spread over several sessions to allow for iterative refinement and reflection.

Time management was guided by prioritizing clear deliverables for each session (e.g., finalize entities, test historical tracking).

</details>


<details>
    <summary>summarize the project i'm working on, and the idea</summary>

The Idea
	•	What: This project is a data modeling and tracking system for simulating relationships and histories in a religion or faith-based context. The model includes entities such as individuals, doctrines (abstract ideas or principles), organizations, faiths (systems of doctrines), and locations. Relationships between these entities are expressed using join tables, allowing for attributes like sentiment (e.g., strongly agree/disagree) or weight (e.g., importance). The project aims to track dynamic relationships, sentiments, and historical changes across all entities, leveraging tools like django-simple-history for versioning and centralized logging for unified insights into changes across all models.
	•	Why: The idea is compelling because it explores the complexity of human relationships with belief systems, organizations, and communities, and how these evolve over time. This is particularly relevant for creating simulations, games, or research tools where faith and societal structures play a central role. The project offers a unique intersection of data modeling, historical tracking, and behavioral simulation, making it an exciting technical challenge.
	•	Scope: The focus is on designing a flexible, scalable data model that prioritizes:
	•	Key entities (individuals, doctrines, organizations, faiths, locations).
	•	Dynamic relationships (e.g., individual alignment with doctrines, organizational affiliation).
	•	Historical tracking of changes across entities using django-simple-history.
	•	A unified way to view all historical changes across the system, either via SQL views, a centralized logging table, or dynamic aggregation in the application layer. Visualizations, UI/UX, and advanced analytics are out of scope for now.

</details>
