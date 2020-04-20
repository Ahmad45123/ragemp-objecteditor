# MC-RP Object Editor
This is a public release of the object editor used on the Mafia City Roleplay server. 

# Usage:
Clientside: 
```js
let obj = mp.objects.new(mp.game.joaat(model), new mp.Vector3(position.x, position.y, position.z));
mp.events.call('objecteditor:start', obj.id);
mp.events.add('objecteditor:finish', (objId, pos, rot) => {
  if(obj.id == objId) {
    // send pos and rot to server and save or do whatever.
    return;
  }
})
```
