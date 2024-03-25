import { Observable, ReplaySubject } from 'rxjs';

export function fromField<T extends object>(target: T) {
  return function <K extends keyof T>(name: K): Observable<T[K]> {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, name);
    if (!!propertyDescriptor?.get && !!propertyDescriptor?.set) {
      throw new Error(
        `Property for field with name "${name.toString()}" of "${
          target.constructor.name
        }" already defined.`,
      );
    }

    let current: T[K] = target[name];
    const subject = new ReplaySubject<T[K]>(1);

    if (target[name] !== undefined) {
      subject.next(target[name]);
    }

    Object.defineProperty(target, name, {
      set(value: T[K]) {
        current = value;
        subject.next(value);
      },
      get() {
        return current;
      },
    });

    return subject.asObservable();
  };
}
