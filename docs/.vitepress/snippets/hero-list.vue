<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            const response = await fetch("/api/contacts");
            pushObjects(await response.json());
        },
    },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="row in contacts.state.objectsInOrder" :key="row.contactId">
            {{ row.name }}
        </li>
    </ul>
</template>
