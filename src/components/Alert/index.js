import Swal from "sweetalert2";

export function basicAlert(title = "", icon = "success", toast = true) {
  Swal.fire({
    title,
    icon,
    position: "top",
    toast,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}
