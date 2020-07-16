import { Plugin, height, width } from "@auto.pro/core"
import { fromEvent, BehaviorSubject, interval, bindCallback, Subject, timer, merge, empty, EMPTY, from, Observable } from 'rxjs'
import { scan, filter, take, tap, map, switchMap, takeUntil, timeInterval, finalize, last, catchError, skipUntil, skip, exhaustMap, withLatestFrom, share, shareReplay, startWith } from 'rxjs/operators';


/**
 * 创建一个悬浮窗
 * @param {string} logo logo图片地址
 * @param {number} duration 悬浮窗开关的过渡时间
 * @param {number} radius 子菜单距离logo的长度（包含子菜单的直径），默认120
 * @param {number} angle 子菜单形成的最大角度，默认120，建议大于90小于180
 * @param {{id: string, color: string, icon: string, callback: Function}[]} items 子菜单数组
 */
export function createFloaty({
    logo = 'https://pro.autojs.org/images/logo.png',
    duration = 200,
    radius = 120,
    angle = 120,
    items = [
        {
            id: 'id_0',
            color: '#047BC3',
            icon: 'ic_play_arrow_black_48dp',
            callback() { }
        },
        {
            id: 'id_1',
            color: '#08BC92',
            icon: 'ic_pause_circle_outline_black_48dp',
            callback() { }
        },
        {
            id: 'id_2',
            color: '#08BC92',
            icon: 'ic_play_circle_outline_black_48dp',
            callback() { }
        },
        {
            id: 'id_3',
            color: '#DC1C2C',
            icon: 'ic_clear_black_48dp',
            callback() { }
        },
        {
            id: 'id_4',
            color: '#bfc1c0',
            icon: 'ic_settings_black_48dp',
            callback() { }
        },
    ]
} = {}): {
    FLOATY: any,
    isOpen$: Observable<boolean>,
    close: Function
} {

    const FLOATY = floaty.rawWindow(`
        <frame w="${2 * radius}" h="${2 * radius}">
            ${
        items.map(item => {
            return `
                <frame id="${item.id}" w="44" h="44" alpha="0" layout_gravity="center">
                    <img w="44" h="44" src="${item.color}" circle="true" />
                    <img w="28" h="28" src="@drawable/${item.icon}" tint="#ffffff" gravity="center" layout_gravity="center" />
                    <img id="id_0_click" w="*" h="*" src="#ffffff" circle="true" alpha="0" />
                </frame>
                    `
        }).join('')
        }
            <frame id="logo" w="44" h="44" alpha="0.4" layout_gravity="center">
                <img w="44" h="44" src="#ffffff" circle="true" alpha="0.8" />
                <img id="img_logo" w="32" h="32" src="${logo}" gravity="center" layout_gravity="center" />
                <img id="logo_click" w="*" h="*" src="#ffffff" alpha="0" />
            </frame>
        </frame>
    `)
    FLOATY.setPosition(-1 * radius + 20, height / 2)

    const toggleFloaty$ = new Subject<boolean>()
    const isFloatyOpen$: Observable<boolean> = toggleFloaty$.asObservable().pipe(
        exhaustMap(() => {
            return from(animation())
        }),
        startWith(false),
        map(v => Boolean(v)),
        shareReplay(1)
    )
    isFloatyOpen$.subscribe()

    function toggleFloaty() {
        toggleFloaty$.next(true)
    }

    function animation() {
        return new Promise((resolve, reject) => {

            const logo = FLOATY['logo']
            const firstElement = items.length > 0 && FLOATY[items[0].id]

            if (!firstElement) {
                return resolve(true)
            }

            const isOpen = firstElement.getX() === logo.getX()
            const direction = FLOATY.getX() < width / 2 ? 1 : -1

            const base = Math.floor(angle / (items.length - 1))
            let α = 180 - angle
            const r = radius - 24

            const animationItems: any[] = []
            items.forEach(item => {
                const element = FLOATY[item.id]

                const offsetX = Math.floor(r * Math.cos(Math.PI * α / 180)) * direction
                const offsetY = Math.floor(r * Math.sin(Math.PI * α / 180)) * -1

                // 偏移的x = cos α * r, y = -1 * sin α * r
                if (isOpen) {
                    animationItems.push(
                        ObjectAnimator.ofFloat(element, "translationX", 0, offsetX),
                        ObjectAnimator.ofFloat(element, "translationY", 0, offsetY),
                        ObjectAnimator.ofFloat(element, "scaleX", 0, 1),
                        ObjectAnimator.ofFloat(element, "scaleY", 0, 1),
                        ObjectAnimator.ofFloat(element, "alpha", 0, 1),
                    )
                } else {
                    animationItems.push(
                        ObjectAnimator.ofFloat(element, "translationX", offsetX, 0),
                        ObjectAnimator.ofFloat(element, "translationY", offsetY, 0),
                        ObjectAnimator.ofFloat(element, "scaleX", 1, 0),
                        ObjectAnimator.ofFloat(element, "scaleY", 1, 0),
                        ObjectAnimator.ofFloat(element, "alpha", 1, 0),
                    )
                }
                α -= base
            })
            const set = new AnimatorSet()
            set.playTogether(...animationItems)
            set.setDuration(duration)

            // logo变亮的按钮在前
            if (isOpen) {
                logo.attr('alpha', 1)
            }
            set.start()
            set.addListener(new JavaAdapter(Animator.AnimatorListener, {
                onAnimationEnd() {
                    if (!isOpen) {
                        logo.attr('alpha', 0.4)
                    }
                    resolve(isOpen)
                }
            }))
        })
    }

    const logoTouch$ = new Subject<any>()
    const down$ = logoTouch$.pipe(
        filter(e => e.getAction() === e.ACTION_DOWN)
    )
    const move$ = logoTouch$.pipe(
        filter(e => e.getAction() === e.ACTION_MOVE),
    )
    const up$ = logoTouch$.pipe(
        filter(e => e.getAction() === e.ACTION_UP)
    )

    down$.pipe(
        map((e) => ({ fx: FLOATY.getX(), fy: FLOATY.getY(), dx: e.getRawX(), dy: e.getRawY() })),
        switchMap(({ fx, fy, dx, dy }) => merge(
            up$.pipe(
                takeUntil(move$),
                tap(() => {
                    toggleFloaty()
                })
            ),
            move$.pipe(
                tap(e_move => {
                    FLOATY.setPosition(fx + e_move.getRawX() - dx, fy + e_move.getRawY() - dy)
                }),
                takeUntil(up$),
            ),
            up$.pipe(
                skipUntil(move$),
                tap(() => {
                    FLOATY.setPosition(FLOATY.getX() <= device.width / 2 - radius ? -1 * radius + 20 : device.width - radius - 20, FLOATY.getY())
                })
            )
        ))
    ).subscribe()

    FLOATY.logo.setOnTouchListener((v, e) => {
        logoTouch$.next(e)
        return true
    })

    const t = setInterval(() => {

    }, 10000);

    items.forEach(item => {
        FLOATY[item.id].on('click', () => {
            toggleFloaty()
            item.callback()
        })
    })

    return {
        FLOATY,
        isOpen$: isFloatyOpen$,
        close() {
            FLOATY.close()
            clearInterval(t)
        }
    }
}

const FloatyPlugin: Plugin = {
    install(option: any) {
        importClass(java.lang.Runnable);
        importClass(android.animation.ObjectAnimator)
        importClass(android.animation.PropertyValuesHolder)
        importClass(android.animation.ValueAnimator)
        importClass(android.animation.Animator)
        importClass(android.animation.AnimatorSet)
        importClass(android.animation.AnimatorListenerAdapter)
        importClass(android.view.animation.AccelerateInterpolator)
        importClass(android.view.animation.TranslateAnimation)
        importClass(android.animation.ObjectAnimator)
        importClass(android.animation.TimeInterpolator)
        importClass(android.os.Bundle)
        importClass(android.view.View)
        importClass(android.view.Window)

        importClass(android.view.animation.AccelerateDecelerateInterpolator)
        importClass(android.view.animation.AccelerateInterpolator)
        importClass(android.view.animation.AnticipateInterpolator)
        importClass(android.view.animation.AnticipateOvershootInterpolator)
        importClass(android.view.animation.BounceInterpolator)
        importClass(android.view.animation.CycleInterpolator)
        importClass(android.view.animation.DecelerateInterpolator)
        importClass(android.view.animation.LinearInterpolator)
        importClass(android.view.animation.OvershootInterpolator)
        importClass(android.view.animation.PathInterpolator)
        importClass(android.widget.Button)
        importClass(android.widget.ImageView)
        importClass(android.widget.TextView)
    }
}

export default FloatyPlugin