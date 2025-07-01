export function test() {
    const asyncPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Promise resolved!");
        }, 1000);
    });
    return asyncPromise;
}

// Example async function using the promise
export async function runTest() {
    try {
        const result = await test();
        console.log(result); // Output after 1 second: "Promise resolved!"
    } catch (error) {
        console.error(error);
    }
}