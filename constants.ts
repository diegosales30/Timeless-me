import { Decade } from './types';

export const DECADES: Decade[] = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];

export const PROMPT_TEMPLATE = (decade: Decade) => `Recreate this photograph to look like it was taken in the ${decade}.

Key instructions:
1. **Facial and Positional Consistency**: You MUST NOT change the person's face, facial features, expression, or physical characteristics in any way. Maintain 100% facial consistency. The person's pose and position in the photo must also remain exactly the same.
2. **Thematic Transformation**: Only change the clothing, hairstyle, and the background environment to match the styles and atmosphere of the ${decade}.
3. **Authenticity and Variety**: Draw deep inspiration from the fashion, culture, and aesthetics of the ${decade}. Each time you generate an image, create a completely new, unique, and random variation. Never use the same environment, clothing, or hairstyle for the same decade.
4. **Clean Image**: The result should be a realistic photograph from that time period. Do not add any dates, text, or watermarks to the final image.`;
