import {init as auth} from "./auth/auth"
import {init as map} from "./map/map"
import {init as l10n} from "./l10n/init"
import {init as search} from "./search/search"
import {init as table} from "./table/table"
// import {init as websocket} from "./websocket/client"
// import {init as socketio} from "./websocket/socketio"

l10n()
auth()
map()
search()
table()
// websocket()
// socketio()
