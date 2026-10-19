<script setup lang="ts">
// Product docs: the margin holds the table of contents, so the pen stays off these pages
const route = useRoute()
const { t } = useI18n()
const link = useKitLink()

const { navGroups, indexDoc } = useDocsList()

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/'
}

const isIndex = computed(() => normalizePath(route.path) === normalizePath(link('/docs')))
</script>

<template>
  <Sheet>
    <SectionLayout :banner="isIndex">
      <template #nav>
        <DocsSidebar :groups="navGroups" />
      </template>
      <template #banner>
        <PageHead
          v-if="indexDoc"
          :title="indexDoc.title"
          title-name="doc.title"
          :lede="indexDoc.description"
          lede-name="doc.description"
          :stop="false"
          long
          variant="section"
        >
          <template #kicker>
            <NuxtLink :to="link('/docs')">
              {{ t('docs.label') }}
            </NuxtLink>
          </template>
        </PageHead>
      </template>
      <NuxtPage />
    </SectionLayout>
  </Sheet>
</template>
