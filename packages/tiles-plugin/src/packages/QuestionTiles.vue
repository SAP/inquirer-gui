<template>
  <div class="tiles">
    <v-item-group mandatory>
      <v-container
        class="pa-0"
        :class="
          question.guiOptions && question.guiOptions.compact ? 'compact' : ''
        "
      >
        <v-row class="tiles-row">
          <v-col
            v-for="(item, itemIndex) in question._choices"
            :key="itemIndex"
            :cols="
              question.guiOptions && question.guiOptions.compact ? 'auto' : '12'
            "
            :lg="question.guiOptions && question.guiOptions.compact ? '3' : '4'"
            md="4"
            sm="6"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <v-item v-slot:default>
              <v-card
                class="d-flex flex-column mx-auto tile-size"
                :class="
                  question.guiOptions && question.guiOptions.compact
                    ? 'compact'
                    : ''
                "
                @click="onAnswerChanged(item.value)"
                :data-itemvalue="item.value"
                tile
                hover
                variant="flat"
                theme="dark"
                :elevation="2"
              >
                <v-card-title>{{ item.name }}</v-card-title>
                <v-card-text
                  class="description"
                  :class="
                    question.guiOptions && question.guiOptions.compact
                      ? 'compact'
                      : ''
                  "
                >
                  {{ item.description }}
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-text class="homepage">
                  <a :href="item.homepage">More Information</a>
                </v-card-text>
                <v-card-actions class="tile-image-container">
                  <img :src="item.image" v-if="item.image" />
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
      },
    },
  },
  methods: {
    applyStyles(newAnswer, oldAnswer) {
      this.toggleSelected(oldAnswer); // deselect old selection
      this.toggleSelected(newAnswer); // select new selection
    },
    toggleSelected(answer) {
      if (answer) {
        const element = document.querySelector(
          `.v-card[data-itemvalue='${answer}']`,
        );
        if (element) {
          element.classList.toggle("selected");
        }
      }
    },
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    },
  },
  props: {
    question: Object,
  },
  mounted: function () {
    this.applyStyles(this.question.answer, undefined);
  },
};
</script>

<style scoped>
.v-card.selected {
  border: 1px solid;
}
.v-card {
  border: none;
  max-width: 100%;
}
.v-card-title {
  word-wrap: break-word;
  word-break: normal;
}
.description.v-card-text {
  text-overflow: ellipsis;
  overflow: hidden;
  color: var(--vscode-foreground, hsla(0, 0%, 100%, 0.7));
}
.description.v-card-text.compact {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  padding-bottom: 0px;
  padding-top: 0px;
}
.homepage.v-card-text {
  padding-bottom: 0;
  flex: inherit;
}
a {
  font-size: 11px;
}
.tiles-row {
  margin: 0px;
}
.tile-image-container {
  max-height: 40%;
}
.tile-image-container > img {
  object-fit: scale-down;
  width: 100%;
  height: 100%;
}
.tile-size {
  width: 400px;
  height: 380px;
}
.tile-size.compact {
  width: 300px;
  height: 285px;
  margin: 0px !important;
}
.container.compact {
  margin-right: 0;
  margin-left: 0;
}
</style>
