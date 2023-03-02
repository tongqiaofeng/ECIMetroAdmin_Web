<template>
	<div id="editContainer" class="edit-wrapper">
		<HeaderBack />
		<div class="form-wrapper mt-30">
			<el-form
				ref="formRef"
				label-width="120px"
				:model="formData"
				:rules="formDataRules"
			>
				<el-form-item
					label="产品类型："
					:rules="{ required: true }"
					prop="equipmentTypeId"
				>
					<el-select
						size="large"
						@change="selectEquipmentType"
						v-model="formData.equipmentTypeId"
					>
						<el-option
							v-for="(item, index) in typeList"
							:key="index"
							:label="item.equipmentTypeName"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="model" label="型号：">
					<el-input
						size="large"
						clearable
						placeholder="请输入型号"
						v-model="formData.model"
						style="width: 207px"
					/>
				</el-form-item>
			</el-form>

			<el-tabs v-model="activeName" class="product-tabs mt-20">
				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="基本信息"
					name="first"
				>
					<el-form
						ref="infoRef"
						:model="formData"
						:rules="formDataRules"
						label-width="120px"
					>
						<!-- 挖掘机系列 -->
						<el-form-item prop="series" label="系列：">
							<el-autocomplete
								v-model="formData.series"
								:fetch-suggestions="querySeriesSearch"
								clearable
								class="input-width"
								placeholder="请选择/输入系列"
								size="large"
								filterable
								:trigger-on-focus="true"
							>
							</el-autocomplete>
						</el-form-item>

						<el-form-item
							class="flex-item-column"
							prop="retailPrice"
							label="厂商零售价："
						>
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入厂商零售价"
								size="large"
								v-model="retailPrice"
								oninput="value=value.replace(/[^\d.]/g,'')"
								clearable
							>
								<template #suffix>万</template>
							</el-input>
							<span class="notice">提示：请输入具体价格</span>
						</el-form-item>
						<el-form-item class="flex-item-column" prop="srot" label="排序：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入排序"
								size="large"
								v-model="formData.sort"
							>
							</el-input>
							<!-- <span class="notice">提示：值越大越靠前</span> -->
						</el-form-item>
						<el-form-item prop="imgUrl" label="图片：">
							<UploadFile
								:fileList="formDataArr.picArr"
								:type="'img'"
								@fileChange="handleImgChange"
							></UploadFile>
						</el-form-item>
						<el-form-item prop="videoUrl" label="视频：">
							<UploadFile
								:fileList="formDataArr.videoArr"
								:type="'video'"
								@fileChange="handleVideoChange"
							></UploadFile>
						</el-form-item>
						<el-form-item prop="recycleIdList" label="关联二手设备：">
							<div class="pos-wrapper">
								<el-collapse style="width: 540px" v-model="collapseName">
									<el-collapse-item title="关联二手设备列表" name="3">
										<div class="collapse-table">
											<el-table
												ref="selectProductTableRef"
												:data="selectRecycleTable"
												border
												stripe
											>
												<el-table-column
													prop="imgUrl"
													align="center"
													label="图片"
												>
													<template #default="{ row }">
														<el-image
															:src="
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: ''
															"
															class="upload-img"
															preview-teleported
															:preview-src-list="[
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: '',
															]"
														/>
													</template>
												</el-table-column>
												<el-table-column
													prop="model"
													align="center"
													label="型号"
												/>
												<el-table-column
													prop="model"
													align="center"
													label="设备编号"
												/>
											</el-table>
										</div>
									</el-collapse-item>
								</el-collapse>
								<el-button
									size="large"
									type="primary"
									class="search-btn-option"
									@click="searchRecycle('recycle')"
									>查 询</el-button
								>
							</div>
						</el-form-item>

						<el-form-item prop="toolIdList" label="关联工装机具：">
							<div class="pos-wrapper">
								<el-collapse style="width: 540px" v-model="collapseName">
									<el-collapse-item title="关联工装机具列表" name="2">
										<div class="collapse-table">
											<el-table
												ref="selectProductTableRef"
												:data="selectToolTable"
												border
												stripe
											>
												<el-table-column
													prop="imgUrl"
													align="center"
													label="图片"
												>
													<template #default="{ row }">
														<el-image
															:src="
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: ''
															"
															class="upload-img"
															preview-teleported
															:preview-src-list="[
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: '',
															]"
														/>
													</template>
												</el-table-column>
												<el-table-column
													prop="toolName"
													align="center"
													label="机具名称"
												/>
											</el-table>
										</div>
									</el-collapse-item>
								</el-collapse>
								<el-button
									size="large"
									type="primary"
									class="search-btn-option"
									@click="searchRecycle('tool')"
									>查 询</el-button
								>
							</div>
						</el-form-item>
						<el-form-item prop="overallViewUrl" label="720看机地址：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入720看机地址"
								size="large"
								v-model="formData.overallViewUrl"
								clearable
							/>
						</el-form-item>
						<el-form-item prop="applicationScene" label="设备应用场景：">
							<el-select
								class="input-width"
								v-model="formDataArr.applicationSceneArr"
								size="large"
								filterable
								allow-create
								clearable
								multiple
								default-first-option
								placeholder="请选择/输入设备应用场景"
							>
								<el-option
									v-for="(item, index) in demandObj.applicationSceneList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="workItems" label="作业项目：">
							<el-select
								size="large"
								class="input-width"
								v-model="formDataArr.workItems"
								filterable
								allow-create
								clearable
								default-first-option
								multiple
								placeholder="请选择/输入作业项目"
							>
								<el-option
									v-for="(item, index) in demandObj.workItemsList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="bucketCapacityDemand" label="斗容需求：">
							<el-autocomplete
								v-model="formData.bucketCapacityDemand"
								:fetch-suggestions="queryBucketCapacityDemand"
								clearable
								class="input-width"
								placeholder="请选择/输入斗容需求"
								size="large"
								filterable
								:trigger-on-focus="true"
							>
							</el-autocomplete>
							<span class="font-tip">m³</span>
						</el-form-item>

						<el-form-item prop="maxReach" label="最大挖掘深度范围：">
							<el-autocomplete
								v-model="formData.maxReach"
								:fetch-suggestions="queryMaxReachRange"
								clearable
								class="input-width"
								placeholder="请选择/输入最大挖掘深度范围"
								size="large"
								filterable
								:trigger-on-focus="true"
							>
							</el-autocomplete>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="发动机"
					name="second"
				>
					<el-form
						ref="engineRef"
						:model="formData"
						:rules="formDataRules"
						label-width="170px"
					>
						<el-form-item prop="engineModel" label="发动机型号：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机型号"
								size="large"
								v-model="formData.engineModel"
								clearable
							/>
						</el-form-item>
						<el-form-item prop="engineNetPower" label="发动机净功率：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机净功率"
								size="large"
								v-model="formData.engineNetPower"
								@input="
									(v) => (formData.engineNetPower = v.replace(/[^\d.]/g, ''))
								"
								clearable
							>
								<template #suffix>kw</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="enginePower" label="发动机总功率：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机总功率"
								size="large"
								v-model="formData.enginePower"
								@input="
									(v) => (formData.enginePower = v.replace(/[^\d.]/g, ''))
								"
								clearable
							>
								<template #suffix>kw</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="engineCylinderBore" label="发动机缸径：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机缸径"
								size="large"
								v-model="formData.engineCylinderBore"
								@input="
									(v) =>
										(formData.engineCylinderBore = v.replace(/[^\d.]/g, ''))
								"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="engineStroke" label="发动机冲程：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机缸径"
								size="large"
								v-model="formData.engineStroke"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="engineDisplacement" label="发动机排量：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机排量"
								size="large"
								v-model="formData.engineDisplacement"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="engineDieselUsed"
							label="发动机可使用生物柴油："
						>
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入发动机可使用生物柴油"
								size="large"
								v-model="formData.engineDieselUsed"
								clearable
							>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="回转机械装置"
					name="third"
				>
					<el-form
						ref="machineRef"
						:model="formData"
						:rules="formDataRules"
						label-width="110px"
					>
						<el-form-item prop="weightWork" label="工作重量：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入工作重量"
								size="large"
								v-model="formData.weightWork"
								clearable
							>
								<template #suffix>kg</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="rotaryMachinerySpeed" label="回转速度：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入回转速度"
								size="large"
								v-model="formData.rotaryMachinerySpeed"
								clearable
							>
								<template #suffix>rpm</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="rotaryMachineryMaxTorque"
							label="最大回转扭矩："
						>
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入回转机械装置-最大回转扭矩"
								size="large"
								v-model="formData.rotaryMachineryMaxTorque"
								clearable
							>
								<template #suffix>KN.m</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="履带&驱动"
					name="fourth"
				>
					<el-form
						ref="trackRef"
						:model="formData"
						:rules="formDataRules"
						label-width="170px"
					>
						<el-form-item prop="trackWidth" label="履带板宽度：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入履带板宽度"
								size="large"
								v-model="formData.trackWidth"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="trackNum" label="履带板数量(每侧)：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入履带板数量(每侧)"
								size="large"
								v-model="formData.trackNum"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="trackThrustWheelNum"
							label="履带支重轮数量(每侧)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入履带支重轮数量(每侧)"
								size="large"
								v-model="formData.trackThrustWheelNum"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="trackCarrierSprocketNum"
							label="托链轮数量(每侧)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入履带托链轮数量"
								size="large"
								v-model="formData.trackCarrierSprocketNum"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item prop="driveGradient" label="驱动爬坡度：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入驱动爬坡度"
								size="large"
								v-model="formData.driveGradient"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item prop="driveMaxSpeed" label="最大行驶速度：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入驱动最大行驶速度"
								size="large"
								v-model="formData.driveMaxSpeed"
								clearable
							>
								<template #suffix>km/h</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="driveMaxTraction" label="最大牵引力：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入驱动最大牵引力"
								size="large"
								v-model="formData.driveMaxTraction"
								clearable
							>
								<template #suffix>kn</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="液压系统"
					name="five"
				>
					<el-form
						ref="systemRef"
						:model="formData"
						:rules="formDataRules"
						label-width="150px"
					>
						<el-form-item
							prop="hydraulicMaxSystemFlow"
							label="最大流量(执行)："
						>
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入最大流量执行"
								size="large"
								v-model="formData.hydraulicMaxSystemFlow"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicEquipmentMaxPressure"
							label="最大压力(设备执行)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入最大压力设备执行"
								size="large"
								v-model="formData.hydraulicEquipmentMaxPressure"
								clearable
							>
								<template #suffix>kpa</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicSteerMaxPressure"
							label="最大压力(行驶)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入最大压力行驶"
								size="large"
								v-model="formData.hydraulicSteerMaxPressure"
								clearable
							>
								<template #suffix>kpa</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicRotationMaxPressure"
							label="最大压力(回转)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入最大压力回转"
								size="large"
								v-model="formData.hydraulicRotationMaxPressure"
								clearable
							>
								<template #suffix>kpa</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hhydraulicBoomCylinderBore"
							label="动臂油缸(缸径)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入动臂油缸缸径"
								size="large"
								v-model="formData.hydraulicBoomCylinderBore"
								clearable
							>
								<template #suffix>kpa</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicBoomCylinderStroke"
							label="动臂油缸(冲程)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入动臂油缸冲程"
								size="large"
								v-model="formData.hydraulicBoomCylinderStroke"
								clearable
							>
								<template #suffix>kpa</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicArmCylinderBore"
							label="斗杆油缸(缸径)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入斗杆油缸缸径"
								size="large"
								v-model="formData.hydraulicArmCylinderBore"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicArmCylinderStroke"
							label="斗杆油缸(冲程)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入斗杆油缸冲程"
								size="large"
								v-model="formData.hydraulicArmCylinderStroke"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicBucketCylinderBore"
							label="铲斗油缸(缸径)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入铲斗油缸缸径"
								size="large"
								v-model="formData.hydraulicBucketCylinderBore"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="hydraulicBucketCylinderStroke"
							label="铲斗油缸(冲程)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入铲斗油缸冲程"
								size="large"
								v-model="formData.hydraulicBucketCylinderStroke"
								clearable
							>
								<template #suffix>mm</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<!-- 二手设备 -->
				<el-tab-pane
					v-if="equipmentTypeName == '二手设备'"
					label="二手设备配置"
					name="seven"
				>
					<el-form
						ref="equipmentFormRef"
						:model="formData"
						:rules="formDataRules"
						label-width="110px"
					>
						<el-form-item
							class="flex-item-column"
							prop="recyclePrice"
							label="设备报价："
						>
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入设备报价"
								size="large"
								v-model="recyclePrice"
								clearable
							>
								<template #suffix>万</template>
							</el-input>
							<span class="notice">提示：可输入具体价格或面议</span>
						</el-form-item>
						<el-form-item prop="recycleEquipmentNo" label="设备编号：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入设备编号"
								size="large"
								v-model="formData.recycleEquipmentNo"
								clearable
							/>
						</el-form-item>
						<el-form-item class="flex-item-column" prop="srot" label="排序：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入排序"
								size="large"
								v-model="formData.sort"
							>
							</el-input>
						</el-form-item>
						<el-form-item prop="imgUrl" label="图片：">
							<UploadFile
								:fileList="formDataArr.picArr"
								:type="'img'"
								@fileChange="handleImgChange"
							></UploadFile>
						</el-form-item>
						<el-form-item prop="videoUrl" label="视频：">
							<UploadFile
								:fileList="formDataArr.videoArr"
								:type="'video'"
								@fileChange="handleVideoChange"
							></UploadFile>
						</el-form-item>
						<el-form-item prop="toolIdList" label="关联工装机具：">
							<div class="pos-wrapper">
								<el-collapse style="width: 540px" v-model="collapseName">
									<el-collapse-item title="关联工装机具列表" name="2">
										<div class="collapse-table">
											<el-table
												ref="selectProductTableRef"
												:data="selectToolTable"
												border
												stripe
											>
												<el-table-column prop="id" align="center" label="ID" />
												<el-table-column
													prop="imgUrl"
													align="center"
													label="图片"
												>
													<template #default="{ row }">
														<el-image
															:src="
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: ''
															"
															class="upload-img"
															preview-teleported
															:preview-src-list="[
																row.imgUrl
																	? config.baseFileUrl +
																	  row.imgUrl.split('|')[0]
																	: '',
															]"
														/>
													</template>
												</el-table-column>
												<el-table-column
													prop="toolName"
													align="center"
													label="机具名称"
												/>
											</el-table>
										</div>
									</el-collapse-item>
								</el-collapse>
								<el-button
									size="large"
									type="primary"
									class="search-btn-option"
									@click="searchRecycle('tool')"
									>查 询</el-button
								>
							</div>
						</el-form-item>
						<el-form-item prop="recycleArea" label="所在地：">
							<elui-china-area-dht
								:leave="2"
								size="large"
								v-model="areaValue"
								placeholder="请选择所在地"
								@change="selectArea"
							></elui-china-area-dht>
						</el-form-item>
						<el-form-item prop="recycleSellState" label="销售状态：">
							<el-radio-group size="large" v-model="formData.recycleSellState">
								<el-radio :label="0">待销售</el-radio>
								<el-radio :label="1">已销售</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item prop="recycleExFactoryYear" label="出厂年份：">
							<el-date-picker
								v-model="formData.recycleExFactoryYear"
								type="year"
								size="large"
								placeholder="请选择出厂年份"
								format="YYYY"
								value-format="YYYY"
							/>
						</el-form-item>
						<el-form-item prop="recycleEquipmentType" label="设备类型：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入设备类型"
								size="large"
								v-model="formData.recycleEquipmentType"
								clearable
							/>
						</el-form-item>
						<el-form-item prop="recycleEquipmentTon" label="设备吨级：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入设备吨级"
								size="large"
								v-model="formData.recycleEquipmentTon"
								clearable
							>
								<template #suffix>t</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="recycleWorkHours" label="工作小时数：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入工作小时数"
								size="large"
								v-model="formData.recycleWorkHours"
								clearable
							>
								<template #suffix>h</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="recyclePaymentType" label="付款方式：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入付款方式 如:微信/支付宝/银行卡/现金"
								size="large"
								v-model="formData.recyclePaymentType"
								clearable
							>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<!-- 动臂与斗杆 -->
				<el-tab-pane
					v-if="equipmentTypeName == '挖掘机&非挖'"
					label="动臂&斗杆"
					name="nine"
				>
					<el-form
						ref="ammRef"
						:model="formData"
						:rules="formDataRules"
						label-width="130px"
					>
						<el-form-item prop="extendBoom" label="伸展动臂：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入伸展动臂"
								size="large"
								v-model="formData.extendBoom"
								clearable
							>
								<!-- <template #suffix>m</template> -->
							</el-input>
						</el-form-item>
						<el-form-item prop="largeVolumeBoom" label="大斗量动臂：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入大斗量动臂"
								size="large"
								v-model="formData.largeVolumeBoom"
								clearable
							>
								<!-- <template #suffix>m</template> -->
							</el-input>
						</el-form-item>
						<el-form-item prop="extendStick" label="伸展斗杆：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入伸展斗杆"
								size="large"
								v-model="formData.extendStick"
								clearable
							>
								<!-- <template #suffix>tb</template> -->
							</el-input>
						</el-form-item>
						<el-form-item prop="largeVolumeStick" label="大容量型斗杆：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入大容量型斗杆"
								size="large"
								v-model="formData.largeVolumeStick"
								clearable
							>
								<!-- <template #suffix>ub</template> -->
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane
					v-if="equipmentTypeName != '二手设备'"
					label="维修加注容量"
					name="six"
				>
					<el-form
						ref="repairRef"
						:model="formData"
						:rules="formDataRules"
						label-width="170px"
					>
						<el-form-item prop="bucketCapacity" label="铲斗容量：">
							<el-input
								type="text"
								class="input-width"
								placeholder="请输入铲斗容量"
								size="large"
								v-model="formData.bucketCapacity"
								clearable
							>
								<template #suffix>m³</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="maxReachRange" label="最大挖掘深度：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入最大挖掘深度"
								size="large"
								v-model="formData.maxReachRange"
								clearable
							>
							</el-input>
						</el-form-item>
						<el-form-item prop="capacityFuelTank" label="燃油箱容量：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入燃油箱容量"
								size="large"
								v-model="formData.capacityFuelTank"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="capacityCooling" label="冷却系统：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入冷却系统"
								size="large"
								v-model="formData.capacityCooling"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="capacityEngineOil"
							label="发动机机油(含滤清器)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入发动机机油"
								size="large"
								v-model="formData.capacityEngineOil"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="capacityRotationDrive" label="回转驱动(每个)：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入回转驱动(每个)"
								size="large"
								v-model="formData.capacityRotationDrive"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="capacityFinalDrive" label="终传动(每个)：">
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入终传动(每个)"
								size="large"
								v-model="formData.capacityFinalDrive"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="capacityHydraulicSystem"
							label="液压系统油容量(含油箱)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入液压系统油容量(含油箱)"
								size="large"
								v-model="formData.capacityHydraulicSystem"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
						<el-form-item
							prop="capacityHydraulicTank"
							label="液压油箱(含吸入管)："
						>
							<el-input
								type="number"
								class="input-width"
								placeholder="请输入液压油箱(含吸入管)"
								size="large"
								v-model="formData.capacityHydraulicTank"
								clearable
							>
								<template #suffix>L</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="产品概述" name="eight">
					<el-form
						ref="descRef"
						:model="formData"
						:rules="formDataRules"
						label-width="110px"
					>
						<el-form-item prop="content" label="产品概述：">
							<TEdtior ref="editorCpnRef" :content="editorContent" />
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>

			<div class="btn-fixed-bottom">
				<el-button
					size="large"
					type="primary"
					class="post-btn"
					v-preventClick
					style="width: 150px"
					@click="postForm"
					>提 交</el-button
				>
			</div>
		</div>

		<!-- 二手设备选择弹窗 -->
		<SectionToolDialog
			ref="sectionRecycleRef"
			:title="'二手设备选择'"
			:list="recycleList"
			:status="productClickStatus"
			@confirm="getSelctedRecycleData"
		>
			<template #pagination>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleRecycleChange"
							:current-page="recycleQuery.page"
							:default-page-size="recycleQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="recycleQuery.total"
						>
						</el-pagination>
					</div>
				</div>
			</template>
		</SectionToolDialog>

		<!-- 工装机具选择弹窗 -->
		<SectionToolDialog
			ref="sectionToolRef"
			:title="'工装机具选择'"
			:list="toolList"
			:status="productClickStatus"
			@confirm="getSelctedRecycleData"
		>
			<template #pagination>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleRecycleChange"
							:current-page="recycleQuery.page"
							:default-page-size="recycleQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="recycleQuery.total"
						>
						</el-pagination>
					</div>
				</div>
			</template>
		</SectionToolDialog>
	</div>
</template>

<script name="productEdit" setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as ProductApi from '@/request/api/product';
import * as ToolApi from '@/request/api/tool';
import { ElMessage } from 'element-plus';
import { uploadFile } from '@/request/api/api';
import config from '@/config/index';
import { EluiChinaAreaDht } from 'elui-china-area-dht';
import SectionToolDialog from './components/section-tool-dialog/index.vue';
import { useSaveStore } from '@/store/saveStore';
import _ from 'lodash';
import useClipboard from 'vue-clipboard3';

const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;

const router = useRouter();
const route = useRoute();

const activeName = ref('first');
const formRef = ref(null);
const saveStore = useSaveStore();

let year = new Date().getFullYear() + '';
const formData = reactive({
	id: null,
	equipmentTypeId: '', // 设备类型id
	// 设备信息
	model: '',
	retailPrice: '', // 厂商零售价 单位为人民币")
	series: '', // 系列(可选可输)
	applicationScene: '', // 设备应用场景 采矿场|采石场(可多个可选可输)
	workItems: '', // 作业项目 |分割 矿石开采|一次破碎，(可多个可选可输)
	bucketCapacityDemand: '', // 斗容需求范围 m³(可选可输)
	maxReachRange: '', // 单位：mm (可选可输)
	dataUrl: '',
	overallViewUrl: '', // 720看机地址
	videoUrl: '', // 视频地址
	engineModel: '', // 发动机型号
	engineNetPower: '', // 发动机净功率kw
	enginePower: '', // 发动机总功率；单位KW
	engineCylinderBore: '', //发动机缸径 单位mm
	engineStroke: '', // 发动机冲程；单位mm
	engineDisplacement: '', // 发动机排量单位L
	engineDieselUsed: '', // 发动机可使用生物柴油

	// 机械装置
	rotaryMachinerySpeed: '', // 回转机械装置-回转速度，单位rpm
	rotaryMachineryMaxTorque: '', // 回转机械装置-最大回转扭矩；单位 KN.m
	weightWork: '', // 重量-工作重量；单位kg
	trackWidth: '', // 履带-履带板宽度；单位mm
	trackNum: 0, // 履带-履带板数量(每侧)
	trackThrustWheelNum: 0, // 履带-履带支重轮数量(每侧)
	trackCarrierSprocketNum: 0, // 履带-托链轮数量(每侧)
	driveGradient: '', // 驱动-爬坡度
	driveMaxSpeed: '', // 驱动-最大行驶速度；单位km/h
	driveMaxTraction: '', // 驱动-最大牵引力；单位kN

	// 液压系统
	hydraulicMaxSystemFlow: '', // 最大流量-执行
	hydraulicEquipmentMaxPressure: '', // 最大压力-设备-执行(单位 kpa)
	hydraulicSteerMaxPressure: '', // 最大压力-行驶(单位 kpa)
	hydraulicRotationMaxPressure: '', // 最大压力-回转(单位 kpa)
	hydraulicBoomCylinderBore: 0, // 动臂油缸-缸径；单位mm
	hydraulicBoomCylinderStroke: 0, // 动臂油缸-冲程；单位mm")
	hydraulicArmCylinderBore: 0, // 斗杆油缸-缸径；单位mm
	hydraulicArmCylinderStroke: 0, // 斗杆油缸-冲程；单位mm
	hydraulicBucketCylinderBore: 0, // 铲斗油缸-缸径
	hydraulicBucketCylinderStroke: 0, // 铲斗油缸-冲程；单位mm

	// 维修加注容量
	capacityFuelTank: '', // 燃油箱容量；单位L
	capacityCooling: '', // 冷却系统;单位L
	capacityEngineOil: '', // 发动机机油；单位L
	capacityRotationDrive: '', // 回转驱动,单位L
	capacityFinalDrive: '', // 终传动;单位L
	capacityHydraulicSystem: '', // 液压系统油容量（含油箱）
	capacityHydraulicTank: '', // 液压油箱（含吸入管）
	bucketCapacity: '', // 铲斗容量；单位m³
	maxReach: 0, // 最大挖掘半径，单位：mm"
	imgUrl: '',

	// 二手设备
	brand: '', // 品牌
	recycleEquipmentNo: '', // 设备编号
	recycleEquipmentType: '', // 设备类型；如：国内组装
	recycleEquipmentTon: '', // 设备吨级；单位T
	recycleWorkHours: '', // 工作小时数；单位H
	recyclePaymentType: '', // 付款方式 如全款或融资租赁
	recycleExFactoryYear: year, // 出厂年份
	recycleArea: '', // 所在地
	recycleSellState: 0, // 销售状态 0：待销售，1：已销售

	toolIdList: [], // 工装机具列表
	recycleIdList: [], // 二手设备id列表
	content: '',
	recycleAreaRelation: '',
	recyclePrice: '', // 二手设备报价

	// 动臂与斗杆
	extendBoom: '', // 伸展动臂
	largeVolumeBoom: '', // 大斗量动臂
	extendStick: '', // 伸展斗杆
	largeVolumeStick: '', // 大斗量斗杆
	sort: 100, // 排序
});

const editorContent = ref('');
const dataUrl = ref('');
const areaValue = ref([]); //'510000', '510100'

const productId = ref(null);
const equipmentTypeName = ref(''); // 类型名
const typeList = ref([]); // 类型列表
const seriesList = ref([]); // 挖掘机系列列表

const modelList = ref([]); // 型号列表
const editorCpnRef = ref(null);

const { toClipboard } = useClipboard();

const formDataRules = reactive({
	model: {
		required: true,
		message: '请输入型号',
		trigger: ['click', 'change'],
	},
	series: { required: true, message: '请选择/输入系列', trigger: 'change' },
	retailPrice: {
		required: true,
		message: '请输入厂商零售价',
		trigger: 'change',
	},
	recyclePrice: {
		required: true,
		message: '请输入设备报价',
		trigger: 'change',
	},
	// dataUrl: { required: true, message: '请上传设备资料', trigger: 'change' },
	imgUrl: { required: true, message: '请选择图片', trigger: 'change' },
	engineModel: {
		required: true,
		message: '请输入发动机型号',
		trigger: 'change',
	},
	engineNetPower: {
		required: true,
		message: '请输入发动机净功率',
		trigger: 'change',
	},
	enginePower: {
		required: true,
		message: '请输入发动机总功率',
		trigger: 'change',
	},
	weightWork: {
		required: true,
		message: '请输入工作重量',
		trigger: 'change',
	},
	recycleEquipmentTon: {
		required: true,
		message: '请输入设备吨级',
		trigger: 'change',
	},
	recycleWorkHours: {
		required: true,
		message: '请输入工作小时数',
		trigger: 'change',
	},
	recycleExFactoryYear: {
		required: true,
		message: '请选择出厂年份',
		trigger: 'change',
	},
	recycleEquipmentType: {
		required: true,
		message: '请输入设备类型',
		trigger: 'change',
	},
	recycleEquipmentNo: {
		required: true,
		message: '请输入设备编号',
		trigger: 'change',
	},
	recycleArea: {
		required: true,
		message: '请输入所在地',
		trigger: 'change',
	},
});

const formDataArr = reactive({
	picArr: [],
	videoArr: [],
	applicationSceneArr: [], // 应用场景
	workItems: [], // 作业项目
});

// 需求数据
const demandObj = reactive({
	applicationSceneList: [], // 设备应用场景列表
	workItemsList: [], // 作业项目列表
	bucketCapacityDemandList: [], // 斗容需求范围列表
	maxReachRangeList: [], // 地面最大挖掘半径范围列表
});

const recycleId = ref(null); // 二手设备id

const retailPrice = ref(null);
const recyclePrice = ref(null);

let query = route.query;
if (Object.keys(query).length) {
	let id = route.query.id;
	productId.value = id;
}

watch(
	() => retailPrice.value,
	(value) => {
		if (value) {
			formData.retailPrice = value;
		}
	}
);

watch(
	() => recyclePrice.value,
	(value) => {
		if (value) {
			formData.recyclePrice = value;
		}
	}
);

// 设备类型列表
const typeNameArr = ['挖掘机&非挖', '山工机械', '二手设备'];
const getProductCateList = async () => {
	const { data: res } = await ProductApi.equipmentTypeListGet();
	if (res.code == 200) {
		if (res.data && res.data.length) {
			const newlist = res.data.filter((item) =>
				typeNameArr.includes(item.equipmentTypeName)
			);
			if (newlist && newlist.length) {
				// 二手设备id
				let recycleTargetIndex = newlist.findIndex(
					(item) => item.equipmentTypeName == '二手设备'
				);
				if (recycleTargetIndex != -1) {
					recycleId.value = newlist[recycleTargetIndex]['id'];
				}

				if (!productId.value && !formData.equipmentTypeId) {
					formData.equipmentTypeId = newlist[0]['id'];
					equipmentTypeName.value = newlist[0]['equipmentTypeName'];

					const productSearchParams: any = saveStore.productSearchParams;
					if (productSearchParams && productSearchParams.equipmentTypeId) {
						formData.equipmentTypeId = productSearchParams.equipmentTypeId;
						equipmentTypeName.value = productSearchParams.equipmentTypeName;
						if (productSearchParams.equipmentTypeName == '二手设备') {
							activeName.value = 'seven';
						} else {
							activeName.value = 'first';
						}
					}
					getSeriesList();
					getDemandList();
				} else {
					getProductDetail('id', productId.value);
				}
				typeList.value = newlist;
			}
		} else {
			typeList.value = [];
		}
	}
};
getProductCateList();

// 系列列表
const getSeriesList = async () => {
	if (formData.equipmentTypeId) {
		const { data: res } = await ProductApi.seriesListGet(
			formData.equipmentTypeId
		);
		if (res.data && res.data.length) {
			seriesList.value = res.data.map((item) => {
				return { value: item };
			});
		} else {
			seriesList.value = [];
		}
	}
};

// 需求列表
const getDemandList = async () => {
	const { data: res } = await ProductApi.allDemandGet(formData.equipmentTypeId);
	let data = res.data;
	demandObj.applicationSceneList = data.applicationSceneList;

	if (data.bucketCapacityDemandList && data.bucketCapacityDemandList.length) {
		demandObj.bucketCapacityDemandList = data.bucketCapacityDemandList.map(
			(item) => {
				return { value: item };
			}
		);
	} else {
		demandObj.bucketCapacityDemandList = [];
	}

	if (data.maxReachRangeList && data.maxReachRangeList.length) {
		demandObj.maxReachRangeList = data.maxReachRangeList.map((item) => {
			if (item) {
				return { value: item };
			}
		});
	} else {
		demandObj.maxReachRangeList = [];
	}
	demandObj.workItemsList = data.workItemsList;
};

// 型号列表
const getModelList = async () => {
	const { data: res } = await ProductApi.modelListGet();
	if (res.code == 200) {
		modelList.value = res.data;
	} else {
		modelList.value = [];
	}
};
getModelList();

// 选择图片
const handleImgChange = (files) => {
	formDataArr.picArr = files.img;
	formData.imgUrl = files.img.join('|');
};

// 选择视频
const handleVideoChange = (files) => {
	formDataArr.videoArr = files.img;
	formData.videoUrl = files.img.join('|');
};

// 选择资料
const selectDataFile = () => {
	const input: any = document.createElement('input');
	input.setAttribute('type', 'file');
	input.onchange = function () {
		const files = this.files[0];
		if (files) {
			_uploadFile(files);
		} else {
			ElMessage.warning('请选择上传文件');
		}
	};
	input.click();
};

// 选择设备类型
const selectEquipmentType = (value) => {
	const typeTarget = typeList.value.find((item) => item.id == value);
	if (typeTarget) {
		equipmentTypeName.value = typeTarget.equipmentTypeName;
		if (typeTarget.equipmentTypeName == '二手设备') {
			activeName.value = 'seven';
		} else {
			activeName.value = 'first';
		}
		getSeriesList();
		getDemandList();
	}
};

// 关联
const collapseName = ref('');
const productClickStatus = ref(''); // 点击的关联选项

const recycleQuery = reactive({
	page: 1,
	pageNum: 6,
	total: 0,
});
const recycleList = ref([]); // 二手设备数据
const selectRecycleTable = ref([]); // 选择的二手设备
const sectionRecycleRef = ref(null);

const toolList = ref([]); // 工装机具数据
const selectToolTable = ref([]); // 选择的工装机具
const sectionToolRef = ref(null);

const searchRecycle = (status: string) => {
	productClickStatus.value = status;
	recycleQuery.page = 1;
	if (status == 'recycle') {
		sectionRecycleRef.value.open();
		nextTick(() => {
			searchRecycleList();
		});
	} else if (status == 'tool') {
		sectionToolRef.value.open();
		// 工装机具
		nextTick(() => {
			searchToolList();
		});
	}
};

// 搜索二手设备数据
const searchRecycleList = async () => {
	const { data: res } = await ProductApi.productSearch({
		page: recycleQuery.page,
		pageNum: recycleQuery.pageNum,
		equipmentTypeId: recycleId.value,
	});
	if (res.code == 200) {
		let data = res.data;
		recycleList.value = data.list;
		recycleQuery.total = data.total;
		_setDefaultSelectedProductList(data.list);
	}
};

// 工装机具列表
const searchToolList = async () => {
	const { data: res } = await ToolApi.toolListGet(recycleQuery);
	if (res.code == 200) {
		let data = res.data;
		toolList.value = data.list;
		recycleQuery.total = data.total;
		_setDefaultSelectedProductList(data.list);
	}
};

// 获取选择弹窗数据
const getSelctedRecycleData = (data: []) => {
	if (productClickStatus.value == 'recycle') {
		// 二手设备
		selectRecycleTable.value = data;
		sectionRecycleRef.value.close();
	} else {
		// 工装机具
		selectToolTable.value = data;
		sectionToolRef.value.close();
	}
};

const handleRecycleChange = (page) => {
	recycleQuery.page = page;
	if (productClickStatus.value == 'recycle') {
		searchRecycleList();
	} else {
		searchToolList();
	}
};

// 选择省市地区
const selectArea = (e) => {
	const oneObj = chinaData[e[0]];
	const twoObj = chinaData[e[1]];
	const area = `${oneObj.label}(${twoObj.label})`;
	formData.recycleArea = area;
	const pos = `${oneObj.value}-${twoObj.value}`;
	formData.recycleAreaRelation = pos;
};

const infoRef = ref(null);
const engineRef = ref(null);
const machineRef = ref(null);
const trackRef = ref(null);
const systemRef = ref(null);
const repairRef = ref(null);
const equipmentFormRef = ref(null);
const descRef = ref(null);

const postForm = async () => {
	_setDefaultPrice();
	const html = editorCpnRef.value.getEditorHtml();
	if (html) {
		formData.content = html.replaceAll(
			config.baseFileUrl,
			config.editorReplaceFlag
		);
		editorContent.value = html;
	} else {
		formData.content = '';
		editorContent.value = '';
	}
	if (
		formDataArr.applicationSceneArr &&
		formDataArr.applicationSceneArr.length
	) {
		formData.applicationScene = formDataArr.applicationSceneArr.join('|');
	} else {
		formData.applicationScene = '';
		formDataArr.applicationSceneArr = [];
	}

	if (formDataArr.workItems && formDataArr.workItems.length) {
		formData.workItems = formDataArr.workItems.join('|');
	} else {
		formDataArr.workItems = [];
		formData.workItems = '';
	}

	if (selectRecycleTable.value && selectRecycleTable.value.length) {
		formData.recycleIdList = selectRecycleTable.value.map((item) => item.id);
	} else {
		formData.recycleIdList = [];
	}

	if (selectToolTable.value && selectToolTable.value.length) {
		formData.toolIdList = selectToolTable.value.map((item) => item.id);
	} else {
		formData.toolIdList = [];
	}

	if (!formData.trackNum) {
		formData.trackNum = 0;
	}
	if (!formData.trackThrustWheelNum) {
		formData.trackThrustWheelNum = 0;
	}
	if (!formData.trackCarrierSprocketNum) {
		formData.trackCarrierSprocketNum = 0;
	}
	if (!formData.hydraulicBoomCylinderBore) {
		formData.hydraulicBoomCylinderBore = 0;
	}
	if (!formData.hydraulicBoomCylinderStroke) {
		formData.hydraulicBoomCylinderStroke = 0;
	}
	if (!formData.hydraulicArmCylinderBore) {
		formData.hydraulicArmCylinderBore = 0;
	}
	if (!formData.hydraulicArmCylinderStroke) {
		formData.hydraulicArmCylinderStroke = 0;
	}
	if (!formData.hydraulicBucketCylinderBore) {
		formData.hydraulicBucketCylinderBore = 0;
	}
	if (!formData.hydraulicBucketCylinderStroke) {
		formData.hydraulicBucketCylinderStroke = 0;
	}
	if (!formData.maxReach) {
		formData.maxReach = 0;
	}
	if (!formData.recycleSellState) {
		formData.recycleSellState = 0;
	}
	if (!formData.sort) {
		formData.sort = 100;
	}

	formRef.value.validate((valid) => {
		if (!valid) {
			ElMessage.warning('请输入型号');
			return;
		}
		if (equipmentTypeName.value == '二手设备') {
			_validateSecondHandForm((valid1) => {
				if (!valid1) return;
				productSave(formData);
			});
		} else {
			_validateMachineForm((valid1) => {
				if (!valid1) return;
				productSave(formData);
			});
		}
	});
};

// 保存数据
const productSave = async (data: object) => {
	const { data: res } = await ProductApi.productSave(data);
	if (res.code == 200) {
		if (!formData.id) {
			ElMessage.success('添加成功');
		} else {
			ElMessage.success('编辑成功');
		}
		router.replace({ path: '/product/list' });
	} else if (res.code == 400) {
		ElMessage.warning(res.data);
	}
};

/**
 * 产品详情
 * mode: id通过id获取详情 model表示通过型号获取详情
 */
const getProductDetail = async (mode = 'id', value: any) => {
	let params = {
		id: null,
		model: null,
	};
	if (mode == 'id') {
		params.id = value;
	} else if (mode == 'model') {
		params.model = value;
	}

	const { data: res } = await ProductApi.productInfoGet(params);
	if (res.code == 200) {
		let data = res.data;
		Object.assign(formData, data);
		getSeriesList();
		getDemandList();

		if (data.dataUrl) {
			dataUrl.value = data.dataUrl.replaceAll(
				config.editorReplaceFlag,
				config.baseFileUrl
			);
		}
		if (data.content) {
			formData.content = data.content.replaceAll(
				config.editorReplaceFlag,
				config.baseFileUrl
			);
			editorContent.value = formData.content;
		}
		if (data.imgUrl) {
			formDataArr.picArr = data.imgUrl.split('|');
		} else {
			formDataArr.picArr = [];
		}
		if (data.videoUrl) {
			formDataArr.videoArr = data.videoUrl.split('|');
		} else {
			formDataArr.videoArr = [];
		}
		if (data.applicationScene) {
			formDataArr.applicationSceneArr = data.applicationScene.split('|');
		} else {
			formDataArr.applicationSceneArr = [];
		}
		if (data.workItems) {
			formDataArr.workItems = data.workItems.split('|');
		} else {
			formDataArr.workItems = [];
		}
		if (typeList.value && typeList.value.length) {
			let targetType = typeList.value.find(
				(item) => item.id === data.equipmentTypeId
			);
			if (targetType) {
				if (targetType.equipmentTypeName == '二手设备') {
					activeName.value = 'seven';
				} else {
					activeName.value = 'first';
				}

				equipmentTypeName.value = targetType.equipmentTypeName;
				formData.equipmentTypeId = targetType.id;
			}
		}
		if (data.recycleExFactoryYear) {
			formData.recycleExFactoryYear = String(data.recycleExFactoryYear);
		}
		if (data.recycleAreaRelation) {
			areaValue.value = data.recycleAreaRelation.split('-');
		}
		if (data.recycleList && data.recycleList.length) {
			formData.recycleIdList = data.recycleList.map((item) => item.id);
			selectRecycleTable.value = data.recycleList;
		} else {
			formData.recycleIdList = [];
			selectRecycleTable.value = [];
		}
		if (data.toolList && data.toolList.length) {
			formData.toolIdList = data.toolList.map((item) => item.id);
			selectToolTable.value = data.toolList;
		} else {
			formData.toolIdList = [];
			selectToolTable.value = [];
		}
		if (data.retailPrice) {
			if (data.retailPrice != '面议') {
				if (!isNaN(Number(data.retailPrice))) {
					retailPrice.value = data.retailPrice;
				} else {
					retailPrice.value = data.retailPrice;
				}
			} else {
				retailPrice.value = data.retailPrice;
			}
		}
		if (data.recyclePrice) {
			if (data.recyclePrice != '面议') {
				if (!isNaN(Number(data.recyclePrice))) {
					recyclePrice.value = data.recyclePrice;
				} else {
					recyclePrice.value = data.recyclePrice;
				}
			} else {
				recyclePrice.value = data.recyclePrice;
			}
		}
	}
};

// 验证挖掘机
const _validateMachineForm = async (callback) => {
	try {
		const valid1 = await infoRef.value.validate();
		if (valid1) {
			try {
				const valid2 = await engineRef.value.validate();
				if (valid2) {
					try {
						const valid3 = await machineRef.value.validate();
						if (valid3) {
							try {
								const valid4 = await repairRef.value.validate();
								callback(true);
							} catch (e3) {
								ElMessage.warning('有维修加注容量信息未填写,请检查');
								callback(false);
							}
						}
					} catch (e2) {
						ElMessage.warning('有回转机械装置信息未填写,请检查');
						callback(false);
					}
				}
			} catch (e1) {
				ElMessage.warning('有发动机信息未填写,请检查');
				callback(false);
			}
		}
	} catch (e) {
		ElMessage.warning('有基本信息未填写,请检查');
		callback(false);
	}
};

// 验证二手设备
const _validateSecondHandForm = async (callback) => {
	try {
		const valid = await equipmentFormRef.value.validate();
		callback(true);
	} catch (e) {
		ElMessage.warning('有二手设备信息未填写,请检查');
		callback(false);
		return;
	}
};

// 上传文件
const _uploadFile = async (file: any) => {
	const res: any = await uploadFile(file);
	let url = res.data.url;
	if (url) {
		ElMessage.success('上传成功');
		dataUrl.value = config.baseFileUrl + url;
		formData.dataUrl = dataUrl.value.replaceAll(
			config.baseFileUrl,
			config.editorReplaceFlag
		);
	} else {
		ElMessage.error('上传失败');
		formData.dataUrl = '';
		dataUrl.value = '';
	}
};

// 设置默认选中的产品数据
const _setDefaultSelectedProductList = (list: []) => {
	if (productClickStatus.value == 'recycle') {
		// 二手设备
		if (selectRecycleTable.value && selectRecycleTable.value.length) {
			let defaultSelectRows = _getDefaultSelectRows(
				list,
				selectRecycleTable.value
			);
			sectionRecycleRef.value.setDefaultSelected(defaultSelectRows);
		}
	} else if (productClickStatus.value == 'tool') {
		// 工装机具
		if (selectToolTable.value && selectToolTable.value.length) {
			let defaultSelectRows = _getDefaultSelectRows(
				list,
				selectToolTable.value
			);
			sectionToolRef.value.setDefaultSelected(defaultSelectRows);
		}
	}
};

// 获取默认选中的行
const _getDefaultSelectRows = (list: any, oldList: any) => {
	const oldIds = oldList.map((item) => item.id);
	const selectRows = list.filter((item) => {
		return oldIds.includes(item.id);
	});
	return selectRows;
};

const _setDefaultPrice = () => {
	// let f = 10000;
	let f = 1;
	if (formData.retailPrice) {
		formData.retailPrice = '';
	}
	if (formData.recyclePrice) {
		formData.recyclePrice = '';
	}
	if (retailPrice.value) {
		if (retailPrice.value != '面议') {
			if (!isNaN(Number(retailPrice.value))) {
				formData.retailPrice = String(retailPrice.value * f);
			}
		} else {
			formData.retailPrice = '';
		}
	} else {
		formData.retailPrice = '';
		retailPrice.value = '';
	}
	if (recyclePrice.value) {
		if (recyclePrice.value != '面议') {
			if (!isNaN(Number(recyclePrice.value))) {
				formData.recyclePrice = String(recyclePrice.value * f);
			}
		} else {
			formData.recyclePrice = '面议';
		}
	} else {
		formData.recyclePrice = '';
		recyclePrice.value = '';
	}
};

const querySeriesSearch = (queryString: string, cb: any) => {
	if (queryString) {
		let newlist = seriesList.value.filter((item) => {
			if (item) {
				return String(item.value).indexOf(queryString) > -1;
			} else {
				return false;
			}
		});
		cb(newlist);
	} else {
		cb(seriesList.value);
	}
};

const queryBucketCapacityDemand = (queryString: string, cb: any) => {
	if (queryString) {
		let newlist = demandObj.bucketCapacityDemandList.filter((item) => {
			if (item) {
				return String(item.value).indexOf(queryString) > -1;
			} else {
				return false;
			}
		});
		cb(newlist);
	} else {
		cb(demandObj.bucketCapacityDemandList);
	}
};

const queryMaxReachRange = (queryString: string, cb: any) => {
	if (queryString) {
		let newlist = demandObj.maxReachRangeList.filter((item) => {
			if (item) {
				return String(item.value).indexOf(queryString) > -1;
			} else {
				return false;
			}
		});
		cb(newlist);
	} else {
		cb(demandObj.maxReachRangeList);
	}
};

const dataUrlInput = (value) => {
	if (value) {
		formData.dataUrl = value.replaceAll(
			config.baseFileUrl,
			config.editorReplaceFlag
		);
		dataUrl.value = value;
	} else {
		formData.dataUrl = '';
		dataUrl.value = '';
	}
};

const copyDataUrl = async () => {
	if (dataUrl.value) {
		await toClipboard(dataUrl.value);
		ElMessage.success('复制成功');
	} else {
		ElMessage.warning('请填写或选择文件');
	}
};
</script>

<style lang="scss" scoped>
.edit-wrapper {
	margin: 20px 20px 40px 20px;
	padding: 20px 20px 40px 20px;
	background-color: #fff;
	border-radius: 10px;
}

.btn-fixed-bottom {
	width: calc(100% - 238px);
	height: 70px;
	position: fixed;
	bottom: 30px;
	right: 30px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	z-index: 99;
	padding-right: 20px;
	.post-btn {
		position: relative;
	}
}

.flex-item-column {
	:deep(.el-form-item__content) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.notice {
			font-size: 12px;
			color: #f56c6c;
		}
	}
}

.pos-wrapper {
	position: relative;
	display: flex;
	justify-content: space-between;
	.search-btn-option {
		width: 70px;
	}
}

:deep(.el-collapse-item__header) {
	height: 40px;
}

.upload-img {
	width: 50px;
	height: 40px;
	z-index: 99;
}
</style>
