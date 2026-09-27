/**
 * 通知メールを送る。DB に保存済みならメールの失敗は応募者に見せない
 * （エラーを見せると再送信され、同じ応募が二重に入るため）。
 * DB にも入らずメールも失敗したときだけ例外を投げる＝応募者にエラーを返す。
 */
export async function notify(send: () => Promise<unknown>, saved: boolean) {
  try {
    await send();
  } catch (err) {
    if (!saved) throw err;
    console.error("[notify failed after db save]", err);
  }
}
