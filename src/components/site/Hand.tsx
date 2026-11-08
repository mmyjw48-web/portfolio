const P = [[150,312],[113,288],[84,256],[64,226],[46,200],[112,198],[101,150],[94,117],[89,86],[146,190],[144,135],[143,99],[142,64],[178,195],[186,144],[191,112],[195,82],[206,211],[223,174],[233,150],[242,126]];
const E = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];

/** The 21 MediaPipe hand landmarks that SignSense's model reads. */
export default function Hand() {
  return (
    <svg className="hand" viewBox="20 40 250 290" aria-hidden="true" focusable="false">
      {E.map(([a, b], i) => <line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} stroke="#EFE8DB" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />)}
      {P.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={[0, 4, 8, 12, 16, 20].includes(k) ? 6 : 4.6} style={{ fill: 'var(--c)' }} stroke="#0D0F1A" strokeWidth="2" />)}
    </svg>
  );
}
