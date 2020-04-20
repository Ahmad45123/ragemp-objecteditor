var res = mp.game.graphics.getScreenActiveResolution(0, 0);

let MOVE_SENSITIVTY = 50;
let ROT_SENSITIVITY = 800;

let selObj = null;
let oldPos;
let oldRot;
let mode = 'Move';
let curBtn;
let oldcursorPos = [0, 0];

let xbox;
let ybox;
let zbox;
let switchbox;
let groundbox;
let cancelbox;
let savebox;

mp.events.add('objecteditor:start', (objid) => {
    mp.gui.cursor.show(true, true);
    selObj = mp.objects.at(objid);
    selObj.setCollision(false, false);
    oldPos = selObj.position;
    oldRot = selObj.rotation;
});

mp.events.add('render', () => {
    if (selObj) {
        mp.game.graphics.drawLine(selObj.position.x - 1.0, selObj.position.y, selObj.position.z, selObj.position.x + 1.0, selObj.position.y, selObj.position.z, 0, 0, 255, 255);
        mp.game.graphics.drawLine(selObj.position.x, selObj.position.y - 1.0, selObj.position.z, selObj.position.x, selObj.position.y + 1.0, selObj.position.z, 255, 0, 0, 255);
        mp.game.graphics.drawLine(selObj.position.x, selObj.position.y, selObj.position.z - 1.0, selObj.position.x, selObj.position.y, selObj.position.z + 1.0, 0, 255, 0, 255);

        xbox = mp.game.graphics.world3dToScreen2d(selObj.position.x + 1.5, selObj.position.y, selObj.position.z);
        ybox = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y + 1.5, selObj.position.z);
        zbox = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y, selObj.position.z + 1.5);
        switchbox = mp.game.graphics.world3dToScreen2d(selObj.position.x - 0.8, selObj.position.y - 0.8, selObj.position.z);
        if(switchbox != undefined) {
            groundbox = {x: switchbox.x+0.065, y: switchbox.y};
            cancelbox = {x: switchbox.x+0.13, y: switchbox.y};
            savebox = {x: switchbox.x+0.195, y: switchbox.y};
        } else {
            cancelbox = undefined, savebox = undefined;
        }

        if(xbox != undefined) {
            mp.game.graphics.drawRect(xbox.x, xbox.y, 0.015, 0.026, 0, 0, 255, 255);
            mp.game.graphics.drawText('X', [xbox.x, xbox.y-0.015], { 
                font: 2, 
                color: [255, 255, 255, 255], 
                scale: [0.5, 0.5], 
                outline: false
            });
        }
        if(ybox != undefined) {
            mp.game.graphics.drawRect(ybox.x, ybox.y, 0.015, 0.026, 255, 0, 0, 255);
            mp.game.graphics.drawText('Y', [ybox.x, ybox.y-0.016], { 
                font: 2, 
                color: [255, 255, 255, 255], 
                scale: [0.5, 0.5], 
                outline: false
            });
        }
        if(zbox != undefined) {
            mp.game.graphics.drawRect(zbox.x, zbox.y, 0.015, 0.026, 0, 255, 0, 255);
            mp.game.graphics.drawText('Z', [zbox.x, zbox.y-0.016], { 
                font: 2, 
                color: [255, 255, 255, 255], 
                scale: [0.5, 0.5], 
                outline: false
            });
        }
        if(switchbox != undefined) {
            mp.game.graphics.drawRect(switchbox.x, switchbox.y, 0.06, 0.026, 255, 255, 255, 255);
            mp.game.graphics.drawRect(groundbox.x, groundbox.y, 0.06, 0.026, 255, 255, 255, 255);
            mp.game.graphics.drawRect(cancelbox.x, cancelbox.y, 0.06, 0.026, 255, 255, 255, 255);
            mp.game.graphics.drawRect(savebox.x, savebox.y, 0.06, 0.026, 255, 255, 255, 255);
            mp.game.graphics.drawText(mode == 'Move' ? 'Rotate' : 'Move', [switchbox.x, switchbox.y-0.016], { 
                font: 0, 
                color: [0, 0, 0, 255], 
                scale: [0.4, 0.4], 
                outline: false
            });
            mp.game.graphics.drawText('Ground', [groundbox.x, groundbox.y-0.016], { 
                font: 0, 
                color: [0, 0, 0, 255], 
                scale: [0.4, 0.4], 
                outline: false
            });
            mp.game.graphics.drawText('Cancel', [cancelbox.x, cancelbox.y-0.016], { 
                font: 0, 
                color: [0, 0, 0, 255], 
                scale: [0.4, 0.4], 
                outline: false
            });
            mp.game.graphics.drawText('Save', [savebox.x, savebox.y-0.016], { 
                font: 0, 
                color: [0, 0, 0, 255], 
                scale: [0.4, 0.4], 
                outline: false
            });
        }

        let pos = mp.gui.cursor.position;
        let cursorDir = {x: pos[0]-oldcursorPos[0], y: pos[1]-oldcursorPos[1]};
        cursorDir.x /= res.x;
        cursorDir.y /= res.y;

        if(curBtn == 'x') { 
            let mainPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y, selObj.position.z);
            let refPos;
            if(mode == 'Move') {
                refPos = mp.game.graphics.world3dToScreen2d(selObj.position.x+1, selObj.position.y, selObj.position.z);
            } else {
                refPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y+1, selObj.position.z);
            }
            if(mainPos == undefined || refPos == undefined) return;
            var screenDir = {x: refPos.x-mainPos.x, y: refPos.y-mainPos.y};
            var magnitude = cursorDir.x*screenDir.x + cursorDir.y*screenDir.y;
            if(mode == 'Move') {
                selObj.position = new mp.Vector3(selObj.position.x+magnitude*MOVE_SENSITIVTY, selObj.position.y, selObj.position.z);
            } else {
                selObj.rotation = new mp.Vector3(selObj.rotation.x-magnitude*ROT_SENSITIVITY, selObj.rotation.y, selObj.rotation.z);
            }

        } else if(curBtn == 'y') {
            let mainPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y, selObj.position.z);
            let refPos;
            if(mode == 'Move') {
                refPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y+1, selObj.position.z);
            } else {
                refPos = mp.game.graphics.world3dToScreen2d(selObj.position.x+1, selObj.position.y, selObj.position.z);
            }
            if(mainPos == undefined || refPos == undefined) return;
            var screenDir = {x: refPos.x-mainPos.x, y: refPos.y-mainPos.y};
            var magnitude = cursorDir.x*screenDir.x + cursorDir.y*screenDir.y;
            if(mode == 'Move') {
                selObj.position = new mp.Vector3(selObj.position.x, selObj.position.y+magnitude*MOVE_SENSITIVTY, selObj.position.z);
            } else {
                selObj.rotation = new mp.Vector3(selObj.rotation.x, selObj.rotation.y+magnitude*ROT_SENSITIVITY, selObj.rotation.z);
            }

        } else if(curBtn == 'z') {
            let mainPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y, selObj.position.z);
            let refPos = mp.game.graphics.world3dToScreen2d(selObj.position.x, selObj.position.y, selObj.position.z+1);
            if(mainPos == undefined || refPos == undefined) return;
            var screenDir = {x: refPos.x-mainPos.x, y: refPos.y-mainPos.y};
            var magnitude = cursorDir.x*screenDir.x + cursorDir.y*screenDir.y;
            if(mode == 'Move') {
                selObj.position = new mp.Vector3(selObj.position.x, selObj.position.y, selObj.position.z+magnitude*MOVE_SENSITIVTY);
            } else {
                selObj.rotation = new mp.Vector3(selObj.rotation.x, selObj.rotation.y, selObj.rotation.z+cursorDir.x*ROT_SENSITIVITY*0.2); //Here direction can be determined by just x axis of mouse, hence the *0.2
            }
        }
        oldcursorPos = pos;
    }
});

mp.events.add('click', (x, y, upOrDown, leftOrRight, relativeX, relativeY, worldPosition, hitEntity) => {
    if(!selObj) return;
    
    let mouseRel = {x: x/res.x, y: y/res.y};

    if (upOrDown == 'up') {
        curBtn = '';
    } else if (upOrDown == 'down') {
        if(xbox != undefined && mouseRel.x >= xbox.x-0.01 && mouseRel.x <= xbox.x+0.009 && mouseRel.y >= xbox.y-0.015 && mouseRel.y <= xbox.y+0.009) {
            curBtn = 'x';
        } else if(ybox != undefined && mouseRel.x >= ybox.x-0.01 && mouseRel.x <= ybox.x+0.009 && mouseRel.y >= ybox.y-0.015 && mouseRel.y <= ybox.y+0.009) {
            curBtn = 'y';
        } else if(zbox != undefined && mouseRel.x >= zbox.x-0.01 && mouseRel.x <= zbox.x+0.009 && mouseRel.y >= zbox.y-0.015 && mouseRel.y <= zbox.y+0.009) {
            curBtn = 'z';
        } else if(switchbox != undefined && mouseRel.x >= switchbox.x-0.03 && mouseRel.x <= switchbox.x+0.03 && mouseRel.y >= switchbox.y-0.015 && mouseRel.y <= switchbox.y+0.009) {
            switchMode();
        } else if(groundbox != undefined && mouseRel.x >= groundbox.x-0.03 && mouseRel.x <= groundbox.x+0.03 && mouseRel.y >= groundbox.y-0.015 && mouseRel.y <= groundbox.y+0.009) {
            groundObject();
        } else if(cancelbox != undefined && mouseRel.x >= cancelbox.x-0.03 && mouseRel.x <= cancelbox.x+0.03 && mouseRel.y >= cancelbox.y-0.015 && mouseRel.y <= cancelbox.y+0.009) {
            cancel();
        } else if(savebox != undefined && mouseRel.x >= savebox.x-0.03 && mouseRel.x <= savebox.x+0.03 && mouseRel.y >= savebox.y-0.015 && mouseRel.y <= savebox.y+0.009) {
            saveChanges();
        }
    }
});

function switchMode() {
    mode = (mode == 'Move' ? 'Rotation' : 'Move');
}

function groundObject() {
    selObj.placeOnGroundProperly();
    let pos = selObj.getCoords(true);
    let rot = selObj.getRotation(2);
    selObj.position = new mp.Vector3(pos.x, pos.y, pos.z);
    selObj.rotation = new mp.Vector3(rot.x, rot.y, rot.z); //FIX BUG WHERE POSITION PROPERTY != GAME POSITION
}

function cancel() {
    selObj.position = oldPos;
    selObj.rotation = oldRot;
    selObj.setCollision(true, true);
    selObj = null;
    mp.gui.cursor.show(false, false);
}

function saveChanges() {
    let pos = selObj.getCoords(true);
    let rot = selObj.getRotation(2);
    mp.events.call('objecteditor:finish', selObj.id, JSON.stringify(pos), JSON.stringify(rot));
    selObj.setCollision(true, true);
    selObj = null;
    mp.gui.cursor.show(false, false);
}