# TRIBE v2 Methodology — How Neuroscience Research Informs Persuasion Shield

## What is TRIBE v2?

TRIBE v2 (Trimodal Brain Encoder) is a foundation model developed by Meta that predicts how the human brain responds to visual, auditory, and textual stimuli. Key facts:

- Trained on **500+ hours of fMRI data** from **700+ volunteers**
- Simulates neural activation patterns at **70,000 voxel resolution** (70x improvement over TRIBE v1)
- Published in **March 2026**
- Demonstrates that specific brain regions respond **predictably** to different types of content

## How TRIBE v2 Informs Our Weighting System

Persuasion Shield does **not** use TRIBE v2 directly — it is a neuroscience research model, not a classification API. Instead, our influence scoring weights are **informed by** TRIBE v2's published findings about neural activation patterns.

### The Core Insight

Different persuasion tactics target different neural pathways, and these pathways have measurably different activation speeds and intensities:

| Neural Pathway | Activation Speed | Intensity | Tactics Targeting This Pathway |
|---|---|---|---|
| **Amygdala** (threat detection) | Very fast | Very high | Fear appeal, scarcity |
| **Anterior Insula** (visceral response) | Fast | High | Fear appeal, emotional manipulation |
| **Ventromedial PFC** (impulse decisions) | Fast | High | Urgency |
| **Dorsolateral PFC** (complex reasoning) | Slow | Reduced by binary framing | False dilemma |
| **Mirror Neuron System** (empathy) | Moderate | High | Emotional manipulation |
| **Anterior Cingulate** (trust evaluation) | Moderate | Moderate | Authority |
| **Medial PFC** (social cognition) | Moderate | Moderate | Social proof, identity |
| **Ventral Striatum** (reward/FOMO) | Moderate | Moderate | Bandwagon |
| **Intraparietal Sulcus** (numerical comparison) | Slow | Moderate | Anchoring |
| **Temporal Cortex** (language processing) | Moderate | Low-moderate | Loaded language |

### Weight Derivation

Tactics that target **deeper, faster-acting neural pathways** (amygdala, insula) receive higher weights because TRIBE v2 shows these produce:
- Stronger neural activations
- Faster processing (bypassing deliberative reasoning)
- Greater potential for behaviour manipulation

| Tactic | Weight | Rationale |
|---|---|---|
| Fear Appeal | 3.0 | Strongest amygdala + insula activation |
| Scarcity | 2.8 | Strong amygdala activation via loss framing |
| Urgency | 2.5 | Reduces deliberative PFC processing |
| False Dilemma | 2.3 | Suppresses complex reasoning pathways |
| Emotional Manipulation | 2.2 | Engages mirror neuron empathy system |
| Authority | 2.0 | Shifts evaluation from analytical to heuristic |
| Social Proof | 1.8 | Activates social cognition, moderate intensity |
| Identity | 1.8 | Self-referential processing, moderate intensity |
| Anchoring | 1.7 | Numerical comparison, slower pathway |
| Reciprocity | 1.5 | Reward pathway, moderate activation |
| Bandwagon | 1.5 | Social reward signals, moderate activation |
| Loaded Language | 1.2 | Semantic priming, lowest direct neural impact |

### Important Disclaimers

1. **We do not claim to measure actual neural activity.** Our extension analyses text patterns, not brain scans.
2. **Weights are approximations** based on published research, not precise fMRI measurements.
3. **TRIBE v2 is cited as scientific grounding**, not as a technology we integrate with.
4. **Individual responses vary.** Neural activation patterns differ between people; our weights represent population-level tendencies from TRIBE v2's training data.

## Multi-Tactic Compounding

TRIBE v2's research on multimodal stimuli shows that **combined stimuli produce activations greater than the sum of individual stimuli**. We model this as:

```
compound_multiplier = 1.0 + (0.15 x (num_unique_tactics - 1))
```

A post combining fear appeal + scarcity + urgency is significantly more manipulative than three separate posts each using one tactic — because the combined neural activation exceeds what any single pathway would produce.

## Context Multipliers

TRIBE v2's findings on domain-specific neural sensitivity inform our context multipliers:

- **Financial context (1.5x):** Financial stimuli produce elevated amygdala activation due to loss aversion
- **Health context (1.3x):** Health-related threats activate stronger self-preservation responses
- **Political context (1.2x):** Identity-relevant political content engages medial PFC more intensely

## References

- Meta AI Research, "TRIBE v2: A Trimodal Brain Encoder for Predicting Neural Responses to Multimodal Stimuli," March 2026
- Cialdini, R. (2021). *Influence: The Psychology of Persuasion*
- Kahneman, D. (2011). *Thinking, Fast and Slow*
- EU AI Act (2024), Article 5 — Prohibited AI Practices
