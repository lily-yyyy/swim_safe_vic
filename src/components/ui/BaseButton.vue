<template>
  <button
    :class="['btn', sizeClass, variantClass]"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
defineProps({
  label: String,
  variant: {
    type: String,
    default: 'primary' // we'll define a custom one below
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg, xl
  }
})

const emit = defineEmits(['click'])
const onClick = (e) => emit('click', e)

const sizeClass = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'py-3 px-5 fs-5 fw-semibold'
}[__props.size]

const variantClass = {
  primary: 'btn-rounded-outline', // use this new class below
  secondary: 'btn-secondary',
  warning: 'btn-warning'
}[__props.variant] || 'btn-rounded-outline'
</script>
