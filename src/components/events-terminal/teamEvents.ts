/**
 * Whether an event is registered as a team (vs. solo). Used by the
 * registration portal and the pack chooser; kept out of the component files
 * so React fast refresh keeps working on them.
 */
export function isTeamEvent(event: { id?: string; code?: string; name?: string; event_type?: string | null; originalEventId?: string }): boolean {
  const name = (event.name || '').toLowerCase();
  const code = (event.code || '').toUpperCase();
  const id = (event.id || '').toLowerCase();
  const originalId = (event.originalEventId || '').toLowerCase();

  // Weblica, XCoders, Spotlight, and Cipher Coding are ALWAYS solo events
  if (name.includes('weblica') || code === 'WB' || id.includes('weblica') || originalId.includes('weblica')) return false;
  if (name.includes('xcoder') || code === 'XC' || id.includes('x_coder') || id.includes('xcoder') || originalId.includes('x_coder') || originalId.includes('xcoder')) return false;
  if (name.includes('spotlight') || code === 'SL' || name.includes('talent') || code === 'TAL' || id.includes('talent') || id.includes('spotlight') || originalId.includes('talent')) return false;
  if (name.includes('cipher') || name.includes('cypher') || code === 'CC' || id.includes('cypher') || id.includes('cipher') || originalId.includes('cypher') || originalId.includes('cipher')) return false;

  // Connections is ALWAYS a team event, even if the backend row says otherwise
  if (name.includes('connection') || code === 'CN' || id.includes('connection') || originalId.includes('connection')) return true;

  // Explicit backend event_type check
  if (event.event_type && event.event_type.toUpperCase() === 'TEAM') return true;
  if (event.event_type && (event.event_type.toUpperCase() === 'SOLO' || event.event_type.toUpperCase() === 'INDIVIDUAL')) return false;

  // Day 1 Team Events
  if (name.includes('paper') || code === 'PP' || id.includes('paper') || originalId.includes('paper')) return true;
  if (name.includes('unsaid') || code === 'US' || id.includes('unsaid') || originalId.includes('unsaid')) return true;

  // Day 2 Team Events
  if (name.includes('bgm') || code === 'BGM' || id.includes('bgm') || originalId.includes('bgm')) return true;
  if (name.includes('mixed') || code === 'MS' || id.includes('mixed') || originalId.includes('mixed')) return true;
  if (name.includes('lyric') || code === 'LL' || id.includes('lyric') || originalId.includes('lyric')) return true;

  return false;
}
