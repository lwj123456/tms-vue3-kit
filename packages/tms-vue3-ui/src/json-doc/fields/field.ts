import { SchemaProp, SchemaPropAttrs } from '@/json-schema/model'

export const ARRAY_KEYWORDS: (keyof SchemaPropAttrs)[] = [
  'anyOf',
  'oneOf',
  'enum',
]
/**
 * 输入字段的可选项
 */
type FieldItem = {
  label: string
  value: string
  group: string
}
/**
 * 编辑文档中的字段，与表单中的一个输入项对应。
 */
export abstract class Field {
  value?: any
  type: string = '' // 字段的类型
  _index: number // 如果字段是数组中的对象，index代表字段所属对象在数组中的饿索引
  private _prop: SchemaProp
  private _required: boolean
  private _visible: boolean
  items?: FieldItem[] // 字段的可选项。应该改个名字，避免和schema中的items混淆。
  itemType?: string
  itemVisible?: { [k: string]: boolean } // 记录字段的选项是否可见

  constructor(prop: SchemaProp, index = -1) {
    let { attrs } = prop
    /**设置默认值*/
    let { type, default: defVal, value } = attrs
    if (type === 'array') {
      this.value = defVal !== undefined ? [...defVal] : value ? value : []
    } else {
      this.value = defVal ? defVal : value ? value : ''
    }
    // this.disabled = attrs.readonly || false
    // this.assocs = schema.assocs
    // if (attrs.type === 'json') {
    //   if (this.value === '') this.value = {}
    //   this.value = JSON.stringify(this.value)
    // }
    this._prop = prop
    this._required = prop.attrs.required ?? false
    this._visible = false
    this._index = index
  }

  get index() {
    return this._index
  }

  get name() {
    return this._prop.name
  }

  get fullname() {
    if (this._prop.isArrayItem) {
      return this._prop.path.replace(/\[\*\]$/, `[${this._index}]`) + this.name
    } else {
      return this._prop.fullname
    }
  }

  get label() {
    return this._prop.attrs.title ?? ''
  }

  get description() {
    return this._prop.attrs.description ?? ''
  }

  get schemaType() {
    return this._prop.attrs.type
  }

  get itemSchemaType() {
    return this._prop.items?.type
  }

  get schemaRequired() {
    return this._prop.attrs.required ?? false
  }

  get required() {
    return this._required
  }

  set required(val: boolean) {
    this._required = val
  }

  get dependencies() {
    return this._prop.dependencies
  }

  get visible() {
    return this._visible
  }

  set visible(val) {
    this._visible = val
  }

  get scheamProp() {
    return this._prop
  }

  get enumGroups() {
    return this._prop.attrs.enumGroups
  }

  get attachment() {
    return this._prop.attachment
  }
}
