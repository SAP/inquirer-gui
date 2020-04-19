<template>
  <div class="tiles">
    <v-item-group mandatory>
      <v-container class="pa-0">
        <v-row class="tiles-row">
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
                :data-itemvalue="item.value"
                height="380"
                tile
                hover
                flat
                dark
                elevation=2
              >
                <v-card-title>{{item.name}}</v-card-title>
                <v-card-text class="description">
                  {{item.description}}
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-text class="homepage">
                  <a :href="item.homepage">More Information</a>
                 </v-card-text>
                <v-card-actions>
                  <v-img class :src="item.image" v-if="item.image"></v-img>
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
  watch: {
    "question.answer": {
      handler: function (newValue, oldValue) {
        this.applyStyles(newValue, oldValue);
      }
    }
  },
  methods: {
    applyStyles(newAnswer, oldAnswer) {
      this.toggleSelected(oldAnswer); // deselect old selection
      this.toggleSelected(newAnswer); // select new selection
    },
    toggleSelected(answer) {
      if (answer) {
        const element = document.querySelector(`.v-card[data-itemvalue='${answer}']`);
        if (element) {
          element.classList.toggle("selected");
        }
      }
    },
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    }
  },
  props: {
    question: Object
  },
  mounted: function() {
    this.applyStyles(this.question.answer, undefined);
  }
};
</script>

<style scoped>
.v-card.selected {
  border: 1px solid;
}
.v-card {
  border: none;
}
.v-card__title {
  word-wrap: break-word;
  word-break: normal;
}
.description.v-card__text {
  text-overflow: ellipsis;
  overflow: hidden;
}
.homepage.v-card__text {
  padding-bottom: 0;
}
a {
  font-size: 11px;
}
.tiles-row {
  margin: 0px;
}
</style>