<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <el-row :gutter="0">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <el-col :span="24">
            <el-form-item
              label="Tên tùy chọn"
              prop="label"
            >
              <el-input
                v-model="formData.label"
                placeholder="Vui lòng nhập tên tùy chọn"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="Giá trị tùy chọn"
              prop="value"
            >
              <el-input
                v-model="formData.value"
                placeholder="Vui lòng nhập giá trị tùy chọn"
                clearable
              >
                <el-select
                  slot="append"
                  v-model="dataType"
                  :style="{width: '100px'}"
                >
                  <el-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button
          type="primary"
          @click="handelConfirm"
        >
          Đồng ý
        </el-button>
        <el-button @click="close">
          Đóng
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isNumberStr } from "@/utils/index";

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id: 100,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: "Vui lòng nhập tên tùy chọn",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            message: "Vui lòng nhập giá trị tùy chọn",
            trigger: "blur"
          }
        ]
      },
      dataType: "string",
      dataTypeOptions: [
        {
          label: "Chuỗi",
          value: "string"
        },
        {
          label: "Số",
          value: "number"
        }
      ]
    };
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    "formData.value": function(val) {
      this.dataType = isNumberStr(val) ? "number" : "string";
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      };
    },
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return;
        if (this.dataType === "number") {
          this.formData.value = parseFloat(this.formData.value);
        }
        this.formData.id = this.id++;
        this.$emit("commit", this.formData);
        this.close();
      });
    }
  }
};
</script>
