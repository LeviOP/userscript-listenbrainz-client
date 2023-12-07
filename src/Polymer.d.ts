type PropConstructorType =
  | StringConstructor
  | ObjectConstructor
  | BooleanConstructor
  | NumberConstructor
  | DateConstructor
  | ArrayConstructor;

interface PropObjectType {
  type: PropConstructorType;
  //value?: ValueForType<T>;
  reflectToAttribute?: boolean;
  readOnly?: boolean;
  notify?: boolean;
  computed?: string;
  observer?: string;
}

interface ElementPrototype {
    is: string;
    properties?: Record<string, PropConstructorType | PropObjectType>
    _template: HTMLTemplateElement;
    listeners: Record<string, string>;
    [key: string]: any;
}

declare function Polymer(prototype: ElementPrototype): CustomElementConstructor;
