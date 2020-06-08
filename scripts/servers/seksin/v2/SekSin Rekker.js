var script = registerScript({
    name: "SekSin Rekker",
    version: "3.0",
    authors: ["1337quip"]
});

var movementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");
var boosted = false;
var textlist = null;
var File = Java.type("java.io.File");
var FileReader = Java.type("java.io.FileReader");
var BufferedReader = Java.type("java.io.BufferedReader");
var FileInputStream = Java.type("java.io.FileInputStream");
var InputStreamReader = Java.type("java.io.InputStreamReader");

function strafe(speed) {
    var a = mc.thePlayer.rotationYaw * 0.017453292;
    var l = mc.thePlayer.rotationYaw * 0.017453292 - Math.PI * 1.5;
    var r = mc.thePlayer.rotationYaw * 0.017453292 + Math.PI * 1.5;
    var rf = mc.thePlayer.rotationYaw * 0.017453292 + Math.PI * 0.19;
    var lf = mc.thePlayer.rotationYaw * 0.017453292 + Math.PI * -0.19;
    var lb = mc.thePlayer.rotationYaw * 0.017453292 - Math.PI * 0.76;
    var rb = mc.thePlayer.rotationYaw * 0.017453292 - Math.PI * -0.76;
    if (mc.gameSettings.keyBindForward.pressed) {
        if (mc.gameSettings.keyBindLeft.pressed && !mc.gameSettings.keyBindRight.pressed) {
            mc.thePlayer.motionX -= (Math.sin(lf) * speed);
            mc.thePlayer.motionZ += (Math.cos(lf) * speed);
        } else if (mc.gameSettings.keyBindRight.pressed && !mc.gameSettings.keyBindLeft.pressed) {
            mc.thePlayer.motionX -= (Math.sin(rf) * speed);
            mc.thePlayer.motionZ += (Math.cos(rf) * speed);
        } else {
            mc.thePlayer.motionX -= (Math.sin(a) * speed);
            mc.thePlayer.motionZ += (Math.cos(a) * speed);
        }
    } else if (mc.gameSettings.keyBindBack.pressed) {
        if (mc.gameSettings.keyBindLeft.pressed && !mc.gameSettings.keyBindRight.pressed) {
            mc.thePlayer.motionX -= (Math.sin(lb) * speed);
            mc.thePlayer.motionZ += (Math.cos(lb) * speed);
        } else if (mc.gameSettings.keyBindRight.pressed && !mc.gameSettings.keyBindLeft.pressed) {
            mc.thePlayer.motionX -= (Math.sin(rb) * speed);
            mc.thePlayer.motionZ += (Math.cos(rb) * speed);
        } else {
            mc.thePlayer.motionX += (Math.sin(a) * speed);
            mc.thePlayer.motionZ -= (Math.cos(a) * speed);
        }
    } else if (mc.gameSettings.keyBindLeft.pressed && !mc.gameSettings.keyBindRight.pressed && !mc.gameSettings.keyBindForward.pressed && !mc.gameSettings.keyBindBack.pressed) {
        mc.thePlayer.motionX += (Math.sin(l) * speed);
        mc.thePlayer.motionZ -= (Math.cos(l) * speed);
    } else if (mc.gameSettings.keyBindRight.pressed && !mc.gameSettings.keyBindLeft.pressed && !mc.gameSettings.keyBindForward.pressed && !mc.gameSettings.keyBindBack.pressed) {
        mc.thePlayer.motionX += (Math.sin(r) * speed);
        mc.thePlayer.motionZ -= (Math.cos(r) * speed);
    }
}

script.registerModule({
    name: "SekSinLongJump",
    category: "Misc",
    description: "LongJump for Mc-SekSin.net | By 1337quip (wasd#9800) & The Moss (crave#6948)",
    settings: {
        newLongJump: Setting.boolean({
            name: "New",
            default: true
        }),
        autoJump: Setting.boolean({
            name: "AutoJump",
            default: false
        })
    }
}, function (module) {
    module.on("update", function () {
        if (module.settings.newLongJump.get())
            module.tag = "New";
        else
            module.tag = "Old";

        if (module.settings.newLongJump.get()) {
            if (!mc.thePlayer.onGround) {
                mc.thePlayer.motionY += 0.042;
                var speed = 0.75;
                var timer = 0.5;
                if (boosted) {
                    speed = 0.6;
                    timer = 1.0;
                    boosted = false;
                }
                var yaw = mc.thePlayer.rotationYaw * 0.017453292;
                mc.thePlayer.motionX = -Math.sin(yaw) * speed;
                mc.thePlayer.motionZ = Math.cos(yaw) * speed;
                mc.timer.timerSpeed = timer;
            } else {
                mc.timer.timerSpeed = 1.0;
            }
        }
        if (module.settings.autoJump.get() && mc.thePlayer.onGround && movementUtils.isMoving())
            mc.thePlayer.jump();
    });
    module.on("move", function (event) {
        if (!module.settings.newLongJump.get()) {
            if (!mc.thePlayer.onGround) {
                mc.thePlayer.motionY += 0.045;
                strafe(0.05);
                mc.timer.timerSpeed = 0.4;
            } else {
                mc.timer.timerSpeed = 1.0;
            }
        }
    });
    module.on("enable", function () {
        boosted = true;
        Chat.print("§8§l§m+---------------------------------------------+")
        Chat.print("");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §a§lPress Jump for Make sinxao Crying!! lmao");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lNot Recommended for Heavy use");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lIf LongJump doesn't work well, please disable AutoJump");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §f§lLongJump for Mc-SekSin.net | By §a§l1337quip §f§l(§a§lwasd#9800§f§l) & §a§lThe Moss §f§l(§a§lcrave#6948§f§l)");
        Chat.print("");
        Chat.print("§8§l§m+---------------------------------------------+");
    });
    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0;
    });
});

script.registerModule({
    name: "SekSinSpeed",
    category: "Misc",
    description: "Speed for Mc-SekSin.net | By 1337quip (wasd#9800)"
}, function (module) {
    module.on("update", function () {
        if (!movementUtils.isMoving())
            return;
        if (mc.thePlayer.onGround) {
            mc.gameSettings.keyBindJump.pressed = false;
            mc.thePlayer.jump();
        }
        if (!mc.thePlayer.onGround && mc.thePlayer.fallDistance <= 0.1) {
            mc.thePlayer.speedInAir = 0.02;
            mc.timer.timerSpeed = 1.5;
        }
        if (mc.thePlayer.fallDistance > 0.1 && mc.thePlayer.fallDistance < 1.3) {
            mc.timer.timerSpeed = 0.7;
        }
        if (mc.thePlayer.fallDistance >= 1.3) {
            mc.timer.timerSpeed = 1;
            mc.thePlayer.speedInAir = 0.02;
        }
    });
    module.on("enable", function () {
        Chat.print("§8§l§m+---------------------------------------------+");
        Chat.print("");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §f§lSpeed for §a§lMc-SekSin.net §f§l| By §a§l1337quip §f§l(§a§lwasd#9800§f§l)");
        Chat.print("");
        Chat.print("§8§l§m+---------------------------------------------+");
    });
    module.on("disable", function () {
        mc.timer.timerSpeed = 1;
        mc.thePlayer.speedInAir = 0.02
    });
});

script.registerModule({
    name: "SekSinVelocity",
    category: "Misc",
    description: "Velocity for Mc-SekSin.net | By 1337quip (wasd#9800)"
}, function (module) {
    module.on("update", function () {
        if (mc.thePlayer.hurtTime > 0 && mc.thePlayer.hurtTime <= 6) {
            mc.thePlayer.motionX *= 0.6;
            mc.thePlayer.motionZ *= 0.6;
        }
    });
    module.on("enable", function () {
        Chat.print("§8§l§m+---------------------------------------------+");
        Chat.print("");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §f§lVelocity for §a§lMc-SekSin.net §f§l| By §a§l1337quip §f§l(§a§lwasd#9800§f§l)");
        Chat.print("");
        Chat.print("§8§l§m+---------------------------------------------+");
    });
});

script.registerModule({
    name: "KillSuits",
    category: "Misc",
    description: "KillSuits | By The Moss (crave#6948)"
}, function (module) {
    module.on("update", function () {

    });
    module.on("enable", function () {
        if (textlist == null) {
            Chat.print("§8§l§m+---------------------------------------------+");
            Chat.print("");
            Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lPlease set path! by .killsuits");
            Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lYour path must not contain spaces!");
            Chat.print("");
            Chat.print("§8§l§m+---------------------------------------------+");
        }
        Chat.print("§8§l§m+---------------------------------------------+");
        Chat.print("");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §f§lKillSuits | By §a§lThe Moss §f§l(§a§lcrave#6948§f§l) & Modify by §a§l1337quip §f§l(§a§lwasd#9800§f§l");
        Chat.print("");
        Chat.print("§8§l§m+---------------------------------------------+");
    });

    module.on("packet", function (event) {
        var packet = event.getPacket();
        if (packet instanceof S02PacketChat && textlist != null) {
            var s02 = packet;
            var message = s02.getChatComponent().getUnformattedText();
            if (message.toLowerCase().indexOf("has been killed by " + mc.thePlayer.getName().toLowerCase() + "!") != -1 ||
                message.toLowerCase().indexOf("weapon could not stand against " + mc.thePlayer.getName().toLowerCase() + "!") != -1 ||
                message.toLowerCase().indexOf("was brutally murdered by " + mc.thePlayer.getName().toLowerCase() + "!") != -1 ||
                message.toLowerCase().indexOf(mc.thePlayer.getName().toLowerCase() + " could not resist killing") != -1 ||
                message.toLowerCase().indexOf(mc.thePlayer.getName().toLowerCase() + " gave a helping hand in ") != -1) {
                var message1 = "";
                var split = message.split(" ");
                if (message.toLowerCase().indexOf(mc.thePlayer.getName().toLowerCase() + " gave a helping hand in ") != -1) {
                    message1 = split[split.length - 2];
                    sendL(message1);
                } else if (message.toLowerCase().indexOf(mc.thePlayer.getName().toLowerCase() + " could not resist killing") != -1) {
                    message1 = split[split.length - 1];
                    sendL(message1);
                } else if (message.toLowerCase().indexOf("weapon could not stand against " + mc.thePlayer.getName().toLowerCase() + "!") != -1) {
                    message1 = split[1];
                    sendL(message1);
                } else if (message.toLowerCase().indexOf("has been killed by " + mc.thePlayer.getName().toLowerCase() + "!") != -1) {
                    message1 = split[1];
                    sendL(message1);
                } else if (message.toLowerCase().indexOf("was brutally murdered by " + mc.thePlayer.getName().toLowerCase() + "!") != -1) {
                    message1 = split[1];
                    sendL(message1);
                }
            }
        }
    });
});

script.registerCommand({
    name: "killsuits",
    aliases: ["ks", "ksuits", "kills"]
}, function (command) {
    command.on("execute", function (args) {
        if (args.length > 1) {
            Chat.print("§8§l§m+---------------------------------------------+");
            Chat.print("");
            Chat.print("§8§l[§9§lLiquidBounce§8§l] §f§lPathed to §a§l" + args[1]);
            Chat.print("");
            Chat.print("§8§l§m+---------------------------------------------+");
            Chat.print("");
            textlist = readFile(args[1]);
        } else {
            Chat.print("§8§l§m+---------------------------------------------+");
            Chat.print("");
            Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lSyntax Error: .killsuits <your path Ex: C:\Users\quip\Desktop\KillSuits.txt");
            Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lYour path must not contain spaces!");
            Chat.print("");
            Chat.print("§8§l§m+---------------------------------------------+");
        }
    });
});

function sendL(message) {
    var message1 = textlist[random(0, textlist.length)].replace("%player%", message);
    mc.thePlayer.sendChatMessage(message1);
};

function random(min, max) {
    if (max <= min) {
        return min;
    }
    return Math.floor((Math.random() * (max - min)) + min);
}

function readFile(filePath) {
    try {
        var file = new File(filePath);
        var reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF8"));
        var content = [];
        var line;

        while ((line = reader.readLine()) != null) {
            content.push(line);
        }

        return content;
    } catch (err) {
        Chat.print("§8§l§m+---------------------------------------------+");
        Chat.print("");
        Chat.print("§8§l[§9§lLiquidBounce§8§l] §c§lUnable to open file " + args[1] + "§c§l!");
        Chat.print("");
        Chat.print("§8§l§m+---------------------------------------------+");
        throw err;
    }
}
