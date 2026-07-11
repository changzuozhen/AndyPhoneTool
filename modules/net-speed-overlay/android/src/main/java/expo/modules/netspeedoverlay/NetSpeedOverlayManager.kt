package expo.modules.netspeedoverlay

import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView

class NetSpeedOverlayManager(private val context: Context) {
  private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private var container: LinearLayout? = null
  private var downloadView: TextView? = null
  private var uploadView: TextView? = null
  private var layoutParams: WindowManager.LayoutParams? = null

  fun show() {
    if (container != null) {
      return
    }

    val download = createLineView("↓ --", Color.parseColor("#4ADE80"))
    val upload = createLineView("↑ --", Color.parseColor("#4DA3FF"))

    downloadView = download
    uploadView = upload

    val gap = dp(8)
    val overlay = LinearLayout(context).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
      val paddingH = dp(12)
      val paddingV = dp(8)
      setPadding(paddingH, paddingV, paddingH, paddingV)
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#E61A1D26"))
        cornerRadius = dp(10).toFloat()
        setStroke(dp(1), Color.parseColor("#2E3340"))
      }
      addView(download)
      addView(View(context).apply {
        layoutParams = LinearLayout.LayoutParams(gap, 1)
      })
      addView(upload)
    }

    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.WRAP_CONTENT,
      WindowManager.LayoutParams.WRAP_CONTENT,
      overlayType(),
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
      PixelFormat.TRANSLUCENT,
    ).apply {
      gravity = Gravity.TOP or Gravity.START
      x = dp(16)
      y = dp(120)
    }

    overlay.setOnTouchListener(createDragListener(params, overlay))

    windowManager.addView(overlay, params)
    container = overlay
    layoutParams = params
  }

  fun updateSpeed(downloadBps: Long, uploadBps: Long) {
    downloadView?.text = "↓ ${NetSpeedFormatter.format(downloadBps)}"
    uploadView?.text = "↑ ${NetSpeedFormatter.format(uploadBps)}"
  }

  fun hide() {
    val overlay = container ?: return
    try {
      windowManager.removeView(overlay)
    } catch (_: IllegalArgumentException) {
    } finally {
      container = null
      downloadView = null
      uploadView = null
      layoutParams = null
    }
  }

  private fun createLineView(text: String, color: Int): TextView {
    return TextView(context).apply {
      this.text = text
      setTextColor(color)
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
      setTypeface(typeface, android.graphics.Typeface.BOLD)
    }
  }

  private fun createDragListener(
    params: WindowManager.LayoutParams,
    overlay: View,
  ): View.OnTouchListener {
    var initialX = 0
    var initialY = 0
    var initialTouchX = 0f
    var initialTouchY = 0f

    return View.OnTouchListener { _, event ->
      when (event.action) {
        MotionEvent.ACTION_DOWN -> {
          initialX = params.x
          initialY = params.y
          initialTouchX = event.rawX
          initialTouchY = event.rawY
          true
        }

        MotionEvent.ACTION_MOVE -> {
          params.x = initialX + (event.rawX - initialTouchX).toInt()
          params.y = initialY + (event.rawY - initialTouchY).toInt()
          windowManager.updateViewLayout(overlay, params)
          true
        }

        else -> false
      }
    }
  }

  private fun overlayType(): Int {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    } else {
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_PHONE
    }
  }

  private fun dp(value: Int): Int {
    return TypedValue.applyDimension(
      TypedValue.COMPLEX_UNIT_DIP,
      value.toFloat(),
      context.resources.displayMetrics,
    ).toInt()
  }
}
