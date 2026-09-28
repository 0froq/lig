import { defineComponent, h } from 'vue'
import Fill from './Fill'

/** An i18n string. An empty message renders a block labeled with the key. */
export default defineComponent({
  name: 'Copy',
  props: {
    k: { type: String, required: true },
    size: { type: Number, default: 8 },
  },
  setup(props) {
    const copy = useCopy()
    return () => h(Fill, { value: copy(props.k), name: props.k, size: props.size })
  },
})
