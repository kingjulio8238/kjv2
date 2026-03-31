Joint Embedding Predictive Architectures (JEPAs) are quickly becoming one of the most important model architectures. Instead of predicting raw pixels or tokens, JEPAs learn by predicting abstract representations in latent space making them far more efficient and closer to how humans actually learn. What started as a single architecture proposed by Yann LeCun has since branched into a growing family of models, each tailored for a different modality: vision, video, audio, 3D, robotics, and more. Here's a list:

- **JEPA / H-JEPA**: avoids predicting every single pixel (too expensive) and rather predicts in latent space. H-JEPA adds hierarchy - short term details vs long term planning ie. how humans actually learn

- **I-JEPA**: built for very efficient vision models. Masks image patches and predicts the semantics and in doing so bypasses heavy compute of traditional autoencoders

- **MC-JEPA & V-JEPA**: both of these are built for videos. MC-JEPA separates content (what an object is) vs motion (how it moves). V-JEPA masks video features with no text labels making it perfect of action tracking at scale

- **Audio-JEPA**: filters out background noise by treating sounds like visuals

- **Point-JEPA & 3D-JEPA**: used primarily in AVs. Uses LiDAR point clouds & volumetric grids

- **ACT-JEPA**: filters out real world noise to learn manipulation tasks efficiently via imitation learning

- **V-JEPA 2**: predicts future physical states of the world caused by an action before it happens

- **LeJEPA**: replaces techniques like masking with an Energy-Based Model (EBM) which mathematically prevents "feature collapse" & ensures the model scales reliably as data increases

- **Causal-JEPA**: for learning true cause-and-effect physics by applying object level masking

- **V-JEPA 2.1**: great for spatial grounding since it combines a dense predictive loss across image & video

- **LeWorldModel**: built directly on LeJEPA's math but super compact - 15M params

- **ThinkJEPA**: uses dense physical prediction with VLM reasoning. Best used when long-term strategy is needed
