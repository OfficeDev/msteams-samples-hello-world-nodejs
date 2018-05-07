"use strict";
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const msteams = require("botbuilder-teams");
const constants = require("../constants");
class RootDialog extends builder.IntentDialog {
    constructor() {
        super();
    }
    // Register the dialogs with the bot
    register(bot) {
        bot.dialog(constants.DialogId.Root, this);
        this.onBegin((session, args, next) => { console.log("onDialogBegin called"); this.onDialogBegin(session, args, next); });
        this.onDefault((session) => { console.log("onDefault called"); this.onMessageReceived(session); });
        console.log("register called for dialog: " + constants.DialogId.Root);
    }
    // Handle start of dialog
    onDialogBegin(session, args, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
        });
    }
    // Handle message
    onMessageReceived(session) {
        return __awaiter(this, void 0, void 0, function* () {
            // Message might contain @mentions which we would like to strip off in the response
            let text = msteams.TeamsMessage.getTextWithoutMentions(session.message);
            session.send("You said: %s", text);
        });
    }
}
exports.RootDialog = RootDialog;

//# sourceMappingURL=RootDialog.js.map
