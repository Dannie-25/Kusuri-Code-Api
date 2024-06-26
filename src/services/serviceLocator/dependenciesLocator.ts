interface Type<T> {
    new (...args: any[]): T;
}
 
type Token<T> = Type<T> | string;
 
type BinderType = 'lazySingleton' | 'factory';
 
type Binder<T> = {
    type: BinderType;
    fn: () => T;
};
 
export class DependencyLocator {
    private factories = new Map<Token<any>, Binder<any>>();

    private lazySingletons = new Map<Token<any>, any>();
 
    private static instance: DependencyLocator;

    private constructor() {}
 
    public bindFactory<T>(token: Type<T> | string, fn: () => T) {
        this.factories.set(token, { type: 'factory', fn });
    }
   
    public bindLazySingleton<T>(token: Type<T> | string, fn: () => T) {
        this.factories.set(token, { type: 'lazySingleton', fn });
    }

    static getInstance(): DependencyLocator {
      if (!DependencyLocator.instance) {
        DependencyLocator.instance = new DependencyLocator();
      }
 
      return DependencyLocator.instance;
    }
 
    public get<T>(token: Type<T> | string): T {
      const factory = this.factories.get(token);
 
      if (!factory) {
        throw new Error(`Dependency ${token} is not registered`);
      }
 
      if (factory.type === 'lazySingleton') {
        const singleton = this.lazySingletons.get(token) || factory.fn();
        this.lazySingletons.set(token, singleton);
 
        return singleton;
      } else {
        return factory.fn();
      }
    }
 
    public clear() {
      this.factories.clear();
      this.lazySingletons.clear();
    }
}