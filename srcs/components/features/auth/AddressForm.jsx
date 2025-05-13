import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerAddressForm } from "@/components/services/apiAddress";

function AddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "male",
      city: "",
      district: "",
      ward: "",
      street: "",
      note: "",
      shippingMethod: "standard",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => registerAddressForm({ addressData: formData }),
    onSuccess: () => {
      alert("Address saved successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const selectedGender = watch("gender");
  const selectedShippingMethod = watch("shippingMethod");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Họ tên và SĐT */}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Họ và Tên"
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="tel"
            placeholder="Số điện thoại liên lạc"
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d+$/,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Giới tính */}
      <div className="flex gap-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            className="hidden"
            {...register("gender")}
            value="male"
          />
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              selectedGender === "male" ? "bg-black" : "bg-white"
            }`}
          >
            {selectedGender === "male" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Anh</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            className="hidden"
            {...register("gender")}
            value="female"
          />
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              selectedGender === "female" ? "bg-black" : "bg-white"
            }`}
          >
            {selectedGender === "female" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Chị</span>
        </label>
      </div>

      {/* Địa chỉ giao hàng */}
      <h3 className="text-xl font-bold">Địa chỉ giao hàng</h3>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-[240px]">
          <select
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("city", { required: "City is required" })}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {/* Add your city options here */}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div className="flex-1 min-w-[240px]">
          <select
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("district", { required: "District is required" })}
          >
            <option value="">Chọn quận/huyện</option>
            {/* Add your district options here */}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-[240px]">
          <select
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("ward", { required: "Ward is required" })}
          >
            <option value="">Chọn xã/thị trấn</option>
            {/* Add your ward options here */}
          </select>
          {errors.ward && (
            <p className="text-red-500 text-sm mt-1">{errors.ward.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Số nhà, tên đường"
            className="w-full min-h-[45px] border border-black bg-white px-3 py-2"
            {...register("street", { required: "Street address is required" })}
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
          )}
        </div>
      </div>

      {/* Ghi chú */}
      <div>
        <input
          type="text"
          placeholder="Ghi chú thêm"
          className="w-full min-h-[45px] border border-red-600 bg-white px-3 py-2 text-red-600"
          {...register("note")}
        />
      </div>

      {/* Dịch vụ giao hàng */}
      <h3 className="text-xl font-bold">Dịch vụ giao hàng</h3>

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            className="hidden"
            {...register("shippingMethod")}
            value="standard"
          />
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              selectedShippingMethod === "standard" ? "bg-black" : "bg-white"
            }`}
          >
            {selectedShippingMethod === "standard" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Giao hàng tiết kiệm</span>
        </label>
        <span className="text-red-600">Dự kiến nhận hàng trong 2-3 ngày</span>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          className="hidden"
          {...register("shippingMethod")}
          value="express"
        />
        <div
          className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
            selectedShippingMethod === "express" ? "bg-black" : "bg-white"
          }`}
        >
          {selectedShippingMethod === "express" && (
            <div className="w-3 h-3 rounded-full bg-white"></div>
          )}
        </div>
        <span>Giao hàng nhanh</span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Đang gửi" : "Gửi địa chỉ"}
      </button>
    </form>
  );
}

export default AddressForm;
