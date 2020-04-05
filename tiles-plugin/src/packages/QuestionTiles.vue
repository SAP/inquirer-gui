<template>
  <div>
    <v-item-group mandatory>
      <v-container class="pa-0">
        <v-row class="tiles">
          <v-col
            v-for="(item, itemIndex) in question._choices"
            :key="itemIndex"
            cols="12"
            md="4"
            sm="6"
          
          >
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                width="400"
                class="d-flex flex-column mx-auto"
                @click="onAnswerChanged(item.value)"
                v-on:click="select"
                height="380"
                tile
                hover
                flat
                dark
                elevation=2
              >
                <v-card-title>{{item.name}}</v-card-title>
                <v-card-text>
                  {{item.description}}
                  <br />
                  <a :href="item.homepage">More Information</a>
                 </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                  <v-img class :src="item.image" height="194" v-if="item.image"></v-img>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
export default {
  name: "QuestionTiles",
  methods: {
    select(event) {
      if (this.selectedItem) {
        // deselect old selection
        this.selectedItem.classList.toggle("selected");
        this.selectedItem.setAttribute("border-style", "none");
      }
      this.selectedItem = event.currentTarget;
      this.selectedItem.setAttribute("border-style", "solid");
      this.selectedItem.classList.toggle("selected");
    },
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    }
  },
  data() {
    return {
      selectedItem: undefined
    }
  },
  props: {
    question: Object
  }
};
</script>

<style scoped>
.v-card.selected {
  border: 1px solid;
}
.v-card__title {
  word-wrap: break-word;
  word-break: normal;
}
a {
  font-size: 11px;
}
.tiles {
  margin: 0px;
}
</style>