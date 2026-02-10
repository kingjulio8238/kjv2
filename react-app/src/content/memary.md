Memary is an open-source memory layer for autonomous agents that I built with friends in UT Austin's Texas Momentum. The project was inspired by Marvin Minsky's *Society of Mind* and how he proposes human memory actually works.

The project was well received by the AI developer community:

- **2,600+ GitHub stars (37 days to 1,000)**
- **195+ forks**
- **450,000+ visits**
- **6,000+ package downloads**
- **1,800+ repository clones**

## Why Build Memary?

At the time we started building Memary, model context windows were limited to anywhere from 8k to 64k tokens. Agents would "forget" previous interactions, losing valuable context about user preferences, prior queries, and accumulated knowledge. Memary was built to give agents a more human-like memory—one that grows, adapts, and prioritizes what matters most.

## How It Works

Memary integrates onto existing agents with minimal developer implementation. The core architecture consists of three main components:

**Knowledge Graphs** — We use graph databases to store knowledge powered by my friends at FalkorDB. Rather than searching the entire graph at once, Memary uses *recursive retrieval* to identify key entities in a query, building a subgraph of those entities with a maximum depth of 2, and using that subgraph to construct focused context. For queries with multiple entities, we use *multi-hop reasoning* to join subgraphs. This way we can significantly reduce latency while delivering more relevant responses.

**Memory Stream** — Captures all entities inserted into the knowledge graph along with their timestamps. This is what we call the *breadth* of a user's knowledge - concepts they've been exposed to, without inferring depth. Memary can map out timelines of interactions and extract recurring themes to anticipate user interests.

**Entity Knowledge Store** — Tracks the frequency and recency of entity references from the memory stream. We refer to this as the *depth* of knowledge - concepts users are more familiar with than others. Entities are ranked by relevance using both frequency and recency, allowing the agent to understand what the user knows well.

These components work together to create a **new context window** that combines the agent's response, most relevant entities, and summarized chat history—providing personalized responses that improve over time.

*For full technical details, see the [README](https://github.com/kingjulio8238/Memary).*
