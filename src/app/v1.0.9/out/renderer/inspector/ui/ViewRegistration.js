import * as Root from '../root/root.js';
import { PreRegisteredView } from './ViewManager.js';
const registeredViewExtensions = [];
export function registerViewExtension(registration) {
    registeredViewExtensions.push(new PreRegisteredView(registration));
}
export function getRegisteredViewExtensions() {
    return registeredViewExtensions.filter(view => Root.Runtime.Runtime.isDescriptorEnabled({ experiment: view.experiment(), condition: view.condition() }));
}
//# sourceMappingURL=ViewRegistration.js.map